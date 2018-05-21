import {
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Maybe } from '../maybe'
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

  public abstract buildWhereInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode>
  public abstract buildWhereUniqueInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode>

  public abstract buildCreateInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode>
  public abstract buildUpdateInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode>

  public abstract buildCreateRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode>
  public abstract buildUpdateRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode>

  public abstract buildCreatePostRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode>
  public abstract buildUpdatePostRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode>
}
