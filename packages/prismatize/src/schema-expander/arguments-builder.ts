import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Namer } from './namer'

export abstract class ArgumentsBuilder {
  public constructor(
    protected schema: GraphQLSchema,
    protected namer: Namer,
  ) {}

  public abstract buildWhereArgumentsForField(field: FieldDefinitionNode)

  public abstract buildWhereArguments(name: string): InputValueDefinitionNode[]
  public abstract buildWhereUniqueArguments(name: string): InputValueDefinitionNode[]

  public abstract buildCreateArguments(name: string): InputValueDefinitionNode[]
  public abstract buildUpdateArguments(name: string): InputValueDefinitionNode[]
  public abstract buildDeleteArguments(name: string): InputValueDefinitionNode[]

  public abstract buildCreateManyArguments(name: string): InputValueDefinitionNode[]
  public abstract buildUpdateManyArguments(name: string): InputValueDefinitionNode[]
  public abstract buildDeleteManyArguments(name: string): InputValueDefinitionNode[]
}