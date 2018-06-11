import { ObjectTypeDefinitionNode } from 'graphql/language'
import { IResolverObject } from 'graphql-tools'
import { tableize } from 'inflected'

import {
  Maybe,
  ResolverFactory,
} from '@currentdesk/prismatize'
import { unwrap } from '@currentdesk/graphql-ast'

import {
  insertOne,
  updateOne,
  deleteOne,
  insertMany,
} from './operations'

export class MongoDBMutationResolverFactory extends ResolverFactory {
  public build({ fields }: ObjectTypeDefinitionNode): Maybe<IResolverObject> {
    if (fields) {
      return fields.reduce((
        resolvers: IResolverObject,
        {
          name: {
            value: name,
          },
          type,
        }
      ) => {
        const { namedType } = unwrap(type)
        const collection = tableize(namedType.name.value)
        const match = name.match(/^([^A-Z]+(?:Many)?)/)

        if (match) {
          const [ action ] = match

          switch (action) {
            case 'create': {
              resolvers[name] = insertOne(namedType.name.value, this.relationshipManager)
              break
            }
            case 'update': {
              resolvers[name] = updateOne(collection)
              break
            }
            case 'delete': {
              resolvers[name] = deleteOne(collection)
              break
            }
            case 'createMany': {
              resolvers[name] = insertMany(collection)
              break
            }
            case 'updateMany': {
              resolvers[name] = () => 0
              break
            }
            case 'deleteMany': {
              resolvers[name] = () => 0
              break
            }
            default: {
              throw new Error('Unknown action')
            }
          }
        }

        return resolvers
      }, {})
    }
  }
}
