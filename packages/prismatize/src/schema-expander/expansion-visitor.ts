import {
  DocumentNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
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

import {
  Relationship,
  RelationshipManager,
} from './relationship-manager'
import { ArgumentsBuilder } from './arguments-builder'
import { FieldBuilder } from './field-builder'
import { InputBuilder } from './input-builder'

const definitionOrder = [
  'ScalarTypeDefinition',
  'DirectiveDefinition',
  'InterfaceTypeDefinition',
  'ObjectTypeDefinition',
]

type ModelBuilder<T> = (node: ObjectTypeDefinitionNode) => T | undefined
type ModelsBuildFn<T> = (nodes: ObjectTypeDefinitionNode[]) => T[]

const chainBuildersForModels = <T>(builders: ModelBuilder<T>[]): ModelsBuildFn<T> => pipe(ap(builders), reject(isNil))

type RelationshipBuilder<T> = (relationship: Relationship) => T | undefined
type RelationshipsBuildFn<T> = (relationships: Relationship[]) => T[]

const chainBuildersForRelationships = <T>(builders: RelationshipBuilder<T>[]): RelationshipsBuildFn<T> => pipe(ap(builders), reject(isNil))

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
    const buildInputsForModels = chainBuildersForModels([
      (node) => this.inputBuilder.buildWhereInput(node),
      (node) => this.inputBuilder.buildCreateInput(node),
      (node) => this.inputBuilder.buildUpdateInput(node),
      (node) => this.inputBuilder.buildWhereUniqueInput(node),
      // (node) => this.inputBuilder.buildCreateRelationalInput(node),
      // (node) => this.inputBuilder.buildUpdateRelationalInput(node),
    ])
    const buildInputsForRelationships = chainBuildersForRelationships([
      (relationship) => this.inputBuilder.buildCreateRelationalInput(relationship),
      (relationship) => this.inputBuilder.buildUpdateRelationalInput(relationship),
    ])

    return [
      ...buildInputsForModels(this.models),
      ...buildInputsForRelationships(this.relationshipManager.allRelationships)
    ]
  }

  private buildQuery(): ObjectTypeDefinitionNode {
    return new ObjectTypeDefinition()
    .name('Query')
    .fields(() => {
      const buildQueryFieldsForModels = chainBuildersForModels([
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
      const buildMutationFieldsForModels = chainBuildersForModels([
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
