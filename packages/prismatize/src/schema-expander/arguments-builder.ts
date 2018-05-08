import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Namer } from './namer'

export abstract class ArgumentsBuilder {
  public constructor(
    protected namer: Namer,
    protected schema: GraphQLSchema,
  ) {}

  public abstract buildWhereArgumentsForField(node: FieldDefinitionNode)

  public abstract buildWhereArguments(name: string): InputValueDefinitionNode[]
  public abstract buildWhereUniqueArguments(name: string): InputValueDefinitionNode[]

  public abstract buildCreateArguments(name: string): InputValueDefinitionNode[]
  public abstract buildUpdateArguments(name: string): InputValueDefinitionNode[]
  public abstract buildDeleteArguments(name: string): InputValueDefinitionNode[]

  public abstract buildCreateManyArguments(name: string): InputValueDefinitionNode[]
  public abstract buildUpdateManyArguments(name: string): InputValueDefinitionNode[]
  public abstract buildDeleteManyArguments(name: string): InputValueDefinitionNode[]
}
