import { GraphQLSchema } from 'graphql/type'

import {
  Options,
  ResolverMap,
} from '.'

export abstract class AutoResolver {
  public resolvers: ResolverMap

  public constructor(protected schema: GraphQLSchema, options: Options) {
    this.resolvers = {}

    this.connect(options)
  }

  protected abstract connect(options: Options)
}
