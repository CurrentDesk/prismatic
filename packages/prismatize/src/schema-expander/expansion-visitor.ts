import {
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  GraphQLSchema,
} from 'graphql/type'
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
  Document,
  ObjectTypeDefinition,
} from '@currentdesk/graphql-ast'

import { RelationshipManager } from './relationship-manager'
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

export class ExpansionVisitor {
  public Document: any = {}

  private models: Array<ObjectTypeDefinitionNode>

  public constructor(
    private argumentsBuilder: ArgumentsBuilder,
    private fieldBuilder: FieldBuilder,
    private inputBuilder: InputBuilder,
    private relationshipManager: RelationshipManager,
    protected schema: GraphQLSchema
  ) {
    this.models = []

    this.Document.leave = this.build
  }

  public ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    this.models.push(node)
    this.relationshipManager.recordRelationships(node)
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
      (node) => this.inputBuilder.buildWhereInput(node),
      (node) => this.inputBuilder.buildCreateInput(node),
      (node) => this.inputBuilder.buildUpdateInput(node),
      (node) => this.inputBuilder.buildWhereUniqueInput(node),
      // (node) => this.inputBuilder.buildCreateRelationalInput(node),
      // (node) => this.inputBuilder.buildUpdateRelationalInput(node),
    ])

    return buildInputsForModels(this.models)
  }

  private buildQuery(): ObjectTypeDefinitionNode {
    return new ObjectTypeDefinition()
    .name('Query')
    .fields(() => {
      const buildQueryFieldsForModels = chainBuilders([
        (node) => this.fieldBuilder.buildReadManyField(node),
        (node) => this.fieldBuilder.buildReadItemField(node),
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
        (node) => this.fieldBuilder.buildCreateItemField(node),
        (node) => this.fieldBuilder.buildUpdateItemField(node),
        (node) => this.fieldBuilder.buildDeleteItemField(node),
        (node) => this.fieldBuilder.buildUpdateManyField(node),
        (node) => this.fieldBuilder.buildDeleteManyField(node),
      ])

      return buildMutationFieldsForModels(this.models)
    })
    .node()
  }
}
