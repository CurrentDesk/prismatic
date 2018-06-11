import {
  DocumentNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { IResolvers } from 'graphql-tools'
import {
  DateTime,
  EmailAddress,
  URL,
  PhoneNumber,
  PostalCode,
} from '@okgrow/graphql-scalars'

import { RelationshipManager } from '../relationship-manager'

import { ResolverFactory } from './resolver-factory'

export class ResolverFactoryVisitor {
  public Document: any = {}
  public resolvers: IResolvers

  private models: Array<ObjectTypeDefinitionNode>

  public constructor(
    private modelResolverFactory: ResolverFactory,
    private queryResolverFactory: ResolverFactory,
    private mutationResolverFactory: ResolverFactory,
    private relationshipManager: RelationshipManager,
  ) {
    this.models = []
    this.resolvers = {
      DateTime,
      EmailAddress,
      URL,
      PhoneNumber,
      PostalCode,
    }

    this.Document.leave = this.build
  }

  public ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    this.models.push(node)
    this.relationshipManager.recordRelationships(node)
  }

  public build(node: DocumentNode) {
    this.models.forEach((node: ObjectTypeDefinitionNode) => {
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
    })
  }
}
