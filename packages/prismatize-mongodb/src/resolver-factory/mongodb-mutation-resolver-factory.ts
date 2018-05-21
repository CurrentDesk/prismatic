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
} from './operations'

export class MongoDBMutationResolverFactory extends ResolverFactory {
  public build(
    {
      name: {
        value: modelName,
      },
      fields,
      directives: modelDirectives,
    }: ObjectTypeDefinitionNode
  ): Maybe<IResolverObject> {
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
        const match = name.match(/^([^A-Z]+)/)

        if (match) {
          const [ action ] = match

          switch (action) {
            case 'create': {
              resolvers[name] = insertOne(collection)
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
