import {
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Namer } from './namer'
import { FieldBuilder } from './field-builder'
import {
  Relationship,
  RelationshipManager,
} from './relationship-manager'

export abstract class InputBuilder {
  public constructor(
    protected schema: GraphQLSchema,
    protected namer: Namer,
    protected fieldBuilder: FieldBuilder,
    protected relationshipManager: RelationshipManager,
  ) {}

  public abstract buildWhereInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined
  public abstract buildWhereUniqueInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined

  public abstract buildCreateInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined
  public abstract buildUpdateInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined

  public abstract buildCreateRelationalInput(relationship: Relationship): InputObjectTypeDefinitionNode | undefined
  public abstract buildUpdateRelationalInput(relationship: Relationship): InputObjectTypeDefinitionNode | undefined
}
