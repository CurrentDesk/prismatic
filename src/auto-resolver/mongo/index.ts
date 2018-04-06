import {
  DirectiveNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import { Db } from 'mongodb'

import { AutoResolver } from '../abstract-auto-resolver'

import { connect } from './database'

import { mapQuery } from './map-query'
import { mapMutation } from './map-mutation'
import { mapObject } from './map-object'

export interface MongoOptions {
  type: 'mongo'
  uri: Promise<string> | string
  database: string
}

export declare interface MongoWhere {
  $and?: MongoWhere[]
  $or?: MongoWhere[]
  $nor?: MongoWhere[]
  $not?: MongoWhere
  [key: string]: any
}

export declare interface MongoContext {
  db: Promise<Db>
  schema: GraphQLSchema

  fields: FieldDefinitionNode[]
  directives?: DirectiveNode[]
}

export class MongoAutoResolver extends AutoResolver {
  private db: Promise<Db>

  public ObjectTypeDefinition(
    {
      name: { value: name },
      fields,
      directives,
    }: ObjectTypeDefinitionNode
  ) {
    const {
      db,
      schema,
    } = this

    const legend: MongoContext = {
      db,
      schema,

      fields,
      directives,
    }

    switch (name) {
      case 'Query': {
        this.resolvers['Query'] = mapQuery(legend)
        break
      }
      case 'Mutation': {
        this.resolvers['Mutation'] = mapMutation(legend)
        break
      }
      default: {
        const resolvers = mapObject(legend)

        if (resolvers !== undefined) {
          this.resolvers[name] = resolvers
        }
      }
    }
  }

  protected connect({ uri, database }) {
    this.db = Promise.resolve(uri).then(uri => connect(uri, database))
  }
}
