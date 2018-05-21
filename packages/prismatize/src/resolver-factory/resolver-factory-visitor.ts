import { ObjectTypeDefinitionNode } from 'graphql/language'
import { IResolvers } from 'graphql-tools'
// import { GraphQLSchema } from 'graphql/type'

import { ResolverFactory } from './resolver-factory'

export class ResolverFactoryVisitor {
  public resolvers: IResolvers

  public constructor(
    protected modelResolverFactory: ResolverFactory,
    protected queryResolverFactory: ResolverFactory,
    protected mutationResolverFactory: ResolverFactory,
    // protected schema: GraphQLSchema,
  ) {
    this.resolvers = {}
  }

  public ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    const {
      name: {
        value: name,
      },
    } = node

    const map = () => {
      switch (name) {
        case 'Query': return this.queryResolverFactory.build(node)
        case 'Mutation': return this.mutationResolverFactory.build(node)
        default: return this.modelResolverFactory.build(node)
      }
    }
    const resolvers = map()

    if (resolvers !== undefined) {
      this.resolvers[name] = resolvers
    }
  }
}
