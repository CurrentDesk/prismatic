import {
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Namer } from './namer'
import { FieldBuilder } from './field-builder'

export abstract class InputBuilder {
  public constructor(
    protected namer: Namer,
    protected fieldBuilder: FieldBuilder,
    protected schema: GraphQLSchema
  ) {}

  public abstract buildWhereInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined
  public abstract buildWhereUniqueInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined

  public abstract buildCreateInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined
  public abstract buildCreateRelationalInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined

  public abstract buildUpdateInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined
  public abstract buildUpdateRelationalInput(node: ObjectTypeDefinitionNode): InputObjectTypeDefinitionNode | undefined
}
