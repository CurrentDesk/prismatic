import { ObjectTypeDefinitionNode } from 'graphql/language'
import { IResolvers } from 'graphql-tools'
import {
  DateTime,
  EmailAddress,
  URL,
  PhoneNumber,
  PostalCode,
} from '@okgrow/graphql-scalars'

import { ResolverFactory } from './resolver-factory'

export class ResolverFactoryVisitor {
  public resolvers: IResolvers

  public constructor(
    protected modelResolverFactory: ResolverFactory,
    protected queryResolverFactory: ResolverFactory,
    protected mutationResolverFactory: ResolverFactory,
  ) {
    this.resolvers = {
      DateTime,
      EmailAddress,
      URL,
      PhoneNumber,
      PostalCode,
    }
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
