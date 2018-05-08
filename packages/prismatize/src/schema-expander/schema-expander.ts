import {
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isObjectType,
  GraphQLSchema,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'
import {
  ap,
  path,
  pipe,
  prop,
  sort,
  isNil,
  ascend,
  reject,
  toLower,
  sortWith,
} from 'ramda'

import {
  getNamedType,
  getRelation,
  Relation,
  Document,
  ObjectTypeDefinition,
} from '@currentdesk/graphql-ast'

import { ArgumentsBuilder } from './arguments-builder'
import { FieldBuilder } from './field-builder'
import { InputBuilder } from './input-builder'

const definitionOrder = [
  'ScalarTypeDefinition',
  'DirectiveDefinition',
  'InterfaceTypeDefinition',
  'ObjectTypeDefinition',
]

type Builder<T> = (node: ObjectTypeDefinitionNode) => T | undefined
type BuildFn<T> = (nodes: ObjectTypeDefinitionNode[]) => T[]

const chainBuilders = <T>(builders: Builder<T>[]): BuildFn<T> => pipe(ap(builders), reject(isNil))

export class SchemaExpander {
  public Document: any = {}

  protected relations: Map<string, Relation[]>

  private models: Array<ObjectTypeDefinitionNode>

  public constructor(
    private argumentsBuilder: ArgumentsBuilder,
    private fieldBuilder: FieldBuilder,
    private inputBuilder: InputBuilder,
    protected schema: GraphQLSchema
  ) {
    this.relations = new Map()
    this.models = []

    this.Document.leave = this.build
  }

  public ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    this.models.push(node)
    this.recordRelations(node)
  }

  public FieldDefinition(node: FieldDefinitionNode) {
    this.argumentsBuilder.buildWhereArgumentsForField(node)

    return node
  }

  // These are all the things that will be dropped if encountered
  public InputObjectTypeDefinition() { return null }
  public ObjectTypeExtension() { return null }
  public InterfaceTypeExtension() { return null }
  public UnionTypeExtension() { return null }
  public EnumTypeExtension() { return null }

  private build(node: DocumentNode) {
    const inputs = this.buildInputs()

    return new Document(node)
    .definitions(models =>
      sortWith(
        [
          ascend(pipe(prop('kind'), definitionOrder.indexOf)),
          ascend(pipe(path(['name', 'value']), toLower))
        ],
        models
      )
      .concat(
        sort(ascend(pipe(path(['name', 'value']), toLower)), inputs),
        this.buildQuery(),
        this.buildMutation(),
      )
    )
    .node()
  }

  private buildInputs(): InputObjectTypeDefinitionNode[] {
    const buildInputsForModels = chainBuilders([
      this.inputBuilder.buildWhereInput,
      this.inputBuilder.buildCreateInput,
      this.inputBuilder.buildUpdateInput,
      this.inputBuilder.buildWhereUniqueInput,
      this.inputBuilder.buildCreateRelationalInput,
      this.inputBuilder.buildUpdateRelationalInput,
    ])

    return buildInputsForModels(this.models)
  }

  private buildQuery(): ObjectTypeDefinitionNode {
    return new ObjectTypeDefinition()
    .name('Query')
    .fields(() => {
      const buildQueryFieldsForModels = chainBuilders([
        this.fieldBuilder.buildReadManyField,
        this.fieldBuilder.buildReadItemField,
      ])

      return buildQueryFieldsForModels(this.models)
    })
    .node()
  }

  private buildMutation(): ObjectTypeDefinitionNode {
    return new ObjectTypeDefinition()
    .name('Mutation')
    .fields(() => {
      const buildMutationFieldsForModels = chainBuilders([
        this.fieldBuilder.buildCreateItemField,
        this.fieldBuilder.buildUpdateItemField,
        this.fieldBuilder.buildDeleteItemField,
        this.fieldBuilder.buildUpdateManyField,
        this.fieldBuilder.buildDeleteManyField,
      ])

      return buildMutationFieldsForModels(this.models)
    })
    .node()
  }

  private recordRelations(
    {
      name: {
        value: name,
      },
      fields,
    }: ObjectTypeDefinitionNode,
  ) {
    (fields || []).forEach(({
      type,
    }) => {
      const gqlType = typeFromAST(this.schema, getNamedType(type))

      if (gqlType && isObjectType(gqlType)) {
        const relation = getRelation(type)
        let list = this.relations.get(name)

        if (list === undefined) {
          this.relations.set(name, list = [])
        }

        list.push(relation)
      }
    })
  }
}
