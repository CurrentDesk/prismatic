import {
  DocumentNode,
  DefinitionNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
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

import { Maybe } from '../maybe'
import {
  Relationship,
  RelationshipManager,
} from '../relationship-manager'

import { ArgumentsBuilder } from './arguments-builder'
import { FieldBuilder } from './field-builder'
import { InputBuilder } from './input-builder'

const definitionOrder = [
  'ScalarTypeDefinition',
  'DirectiveDefinition',
  'InterfaceTypeDefinition',
  'ObjectTypeDefinition',
]

type Builder<I, T> = (item: I) => Maybe<T>
type BuildAll<I, T> = (items: I[]) => T[]

const chainBuilders = <I, T>(builders: Builder<I, T>[]): BuildAll<I, T> => pipe<ReadonlyArray<I>, ReadonlyArray<Maybe<T>>, T[]>(ap(builders), reject<T>(isNil))

export class ExpansionVisitor {
  public Document: any = {}

  private models: ObjectTypeDefinitionNode[]

  public constructor(
    private argumentsBuilder: ArgumentsBuilder,
    private fieldBuilder: FieldBuilder,
    private inputBuilder: InputBuilder,
    private relationshipManager: RelationshipManager,
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

  private build(node: DocumentNode): DocumentNode {
    const inputs = this.buildInputs()

    return new Document(node)
    .definitions(definitions =>
      sortWith<DefinitionNode>(
        [
          ascend(pipe(prop('kind'), kind => definitionOrder.indexOf(kind))),
          ascend(pipe(path(['name', 'value']), toLower))
        ],
        definitions
      )
      .concat(
        sort(ascend(pipe(path(['name', 'value']), toLower)), inputs),
        this.buildQuery(),
        this.buildMutation(),
      )
    )
    .node()
  }

  private buildInputs(): DefinitionNode[] {
    const buildOrderByForModels = chainBuilders([
      (model: ObjectTypeDefinitionNode) => this.inputBuilder.buildOrderByInput(model),
    ])
    const buildInputsForModels = chainBuilders([
      (model: ObjectTypeDefinitionNode) => this.inputBuilder.buildWhereInput(model),
      (model: ObjectTypeDefinitionNode) => this.inputBuilder.buildCreateInput(model),
      (model: ObjectTypeDefinitionNode) => this.inputBuilder.buildUpdateInput(model),
      (model: ObjectTypeDefinitionNode) => this.inputBuilder.buildWhereUniqueInput(model),
    ])
    const buildInputsForRelationships = chainBuilders([
      (relationship: Relationship) => this.inputBuilder.buildCreateRelationalInput(relationship),
      (relationship: Relationship) => this.inputBuilder.buildUpdateRelationalInput(relationship),
      (relationship: Relationship) => this.inputBuilder.buildCreatePostRelationalInput(relationship),
      // (relationship: Relationship) => this.inputBuilder.buildUpdatePostRelationalInput(relationship),
    ])

    return [
      ...buildOrderByForModels(this.models),
      ...buildInputsForModels(this.models),
      ...buildInputsForRelationships(this.relationshipManager.allRelationships)
    ]
  }

  private buildQuery(): ObjectTypeDefinitionNode {
    return new ObjectTypeDefinition()
    .name('Query')
    .fields(() => {
      const buildQueryFieldsForModels = chainBuilders([
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildReadManyField(model),
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildReadItemField(model),
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
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildCreateItemField(model),
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildUpdateItemField(model),
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildDeleteItemField(model),
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildCreateManyField(model),
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildUpdateManyField(model),
        (model: ObjectTypeDefinitionNode) => this.fieldBuilder.buildDeleteManyField(model),
      ])

      return buildMutationFieldsForModels(this.models)
    })
    .node()
  }
}
