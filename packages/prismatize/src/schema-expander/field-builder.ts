import {
  FieldDefinitionNode,
  EnumValueDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Maybe } from '../maybe'
import {
  Relationship,
  RelationshipManager,
} from '../relationship-manager'

import { Namer } from './namer'
import { ArgumentsBuilder } from './arguments-builder'

export abstract class FieldBuilder {
  public constructor(
    protected schema: GraphQLSchema,
    protected namer: Namer,
    protected argumentsBuilder: ArgumentsBuilder,
    protected relationshipManager: RelationshipManager,
  ) {}

  public abstract buildReadManyField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>
  public abstract buildReadItemField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>

  public abstract buildCreateItemField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>
  public abstract buildUpdateItemField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>
  public abstract buildDeleteItemField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>

  public abstract buildCreateManyField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>
  public abstract buildUpdateManyField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>
  public abstract buildDeleteManyField(model: ObjectTypeDefinitionNode): Maybe<FieldDefinitionNode>

  public abstract buildOrderByInputFields(fields: ReadonlyArray<FieldDefinitionNode>): EnumValueDefinitionNode[]

  public abstract buildWhereInputLogicalFields(name: string): InputValueDefinitionNode[]

  public abstract buildWhereInputFields(fields: ReadonlyArray<FieldDefinitionNode>, model: ObjectTypeDefinitionNode): InputValueDefinitionNode[]
  public abstract buildWhereUniqueInputFields(fields: ReadonlyArray<FieldDefinitionNode>, model: ObjectTypeDefinitionNode): InputValueDefinitionNode[]

  public abstract buildCreateInputFields(fields: ReadonlyArray<FieldDefinitionNode>, model: ObjectTypeDefinitionNode): InputValueDefinitionNode[]
  public abstract buildUpdateInputFields(fields: ReadonlyArray<FieldDefinitionNode>, model: ObjectTypeDefinitionNode): InputValueDefinitionNode[]

  public abstract buildCreateRelationalInputField(relationship: Relationship): Maybe<InputValueDefinitionNode>
  public abstract buildConnectRelationalInputField(relationship: Relationship): Maybe<InputValueDefinitionNode>
  public abstract buildDisconnectRelationalInputField(relationship: Relationship): Maybe<InputValueDefinitionNode>
  public abstract buildDeleteRelationalInputField(relationship: Relationship): Maybe<InputValueDefinitionNode>
  // public abstract buildUpdateRelationalInputField(relationship: Relationship): Maybe<InputValueDefinitionNode>

  public abstract buildCreatePostRelationalInputFields(relationship: Relationship): InputValueDefinitionNode[]
}
