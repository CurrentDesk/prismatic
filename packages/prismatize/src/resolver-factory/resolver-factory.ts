import { ObjectTypeDefinitionNode } from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { IResolverObject } from 'graphql-tools'

import { RelationshipManager } from '../relationship-manager'
import { Maybe } from '../maybe'

export abstract class ResolverFactory {
  public constructor(
    protected schema: GraphQLSchema,
    protected relationshipManager: RelationshipManager
  ) {}

  public abstract build(model: ObjectTypeDefinitionNode): Maybe<IResolverObject>
}
