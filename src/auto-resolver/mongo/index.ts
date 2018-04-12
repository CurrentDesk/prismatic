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
    switch (node.name.value) {
      case 'Query': {
        this.resolvers['Query'] = mapQuery(node)
        break
      }
      case 'Mutation': {
        this.resolvers['Mutation'] = mapMutation(node)
        break
      }
      default: {
        const resolvers = mapObject(node, this.schema)

        if (resolvers !== undefined) {
          this.resolvers[node.name.value] = resolvers
        }
      }
    }
  }
}
