import { ObjectTypeDefinitionNode } from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { IResolverObject } from 'graphql-tools'

import { Maybe } from '../maybe'

export abstract class ResolverFactory {
  public constructor(protected schema: GraphQLSchema) {}

  public abstract build(model: ObjectTypeDefinitionNode): Maybe<IResolverObject>
}
