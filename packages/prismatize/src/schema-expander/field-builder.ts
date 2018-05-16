import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { ArgumentsBuilder } from './arguments-builder'
import { Namer } from './namer'

export abstract class FieldBuilder {
  public constructor(
    protected schema: GraphQLSchema,
    protected namer: Namer,
    protected argumentsBuilder: ArgumentsBuilder,
  ) {}

  public abstract buildReadManyField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined
  public abstract buildReadItemField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined

  public abstract buildCreateItemField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined
  public abstract buildUpdateItemField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined
  public abstract buildDeleteItemField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined

  public abstract buildCreateManyField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined
  public abstract buildUpdateManyField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined
  public abstract buildDeleteManyField(node: ObjectTypeDefinitionNode): FieldDefinitionNode | undefined

  public abstract buildWhereInputLogicalFields(name: string): InputValueDefinitionNode[]

  public abstract buildWhereInputFields(fields: ReadonlyArray<FieldDefinitionNode>): InputValueDefinitionNode[]
  public abstract buildWhereUniqueInputFields(fields: ReadonlyArray<FieldDefinitionNode>): InputValueDefinitionNode[]
}
