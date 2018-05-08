import { ObjectTypeDefinitionNode } from 'graphql/language'
import { Db } from 'mongodb'

import { AutoResolver } from '../abstract-auto-resolver'

import { mapQuery } from './map-query'
import { mapMutation } from './map-mutation'
import { mapObject } from './map-object'

export interface MongoWhere {
  $and?: MongoWhere[]
  $or?: MongoWhere[]
  $nor?: MongoWhere[]
  $not?: MongoWhere
  [key: string]: any
}

export interface MongoContext {
  db: Promise<Db>
}

export class MongoAutoResolver extends AutoResolver {
  public ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    const map = () => {
      switch (node.name.value) {
        case 'Query': return mapQuery(node)
        case 'Mutation': return mapMutation(node)
        default: return mapObject(node, this.schema)
      }
    }
    const resolvers = map()

    if (resolvers !== undefined) {
      this.resolvers[node.name.value] = resolvers
    }
  }
}
