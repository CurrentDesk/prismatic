import { GraphQLSchema } from 'graphql/type'

import { ResolverMap } from '.'

export abstract class AutoResolver {
  protected resolvers: ResolverMap

  public constructor(protected schema: GraphQLSchema) {
    this.resolvers = {}
  }

  public getResolvers(): ResolverMap {
    return this.resolvers
  }
}
