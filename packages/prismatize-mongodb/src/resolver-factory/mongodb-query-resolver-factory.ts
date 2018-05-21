import { ObjectTypeDefinitionNode } from 'graphql/language'
import { IResolverObject } from 'graphql-tools'
import { tableize } from 'inflected'

import {
  find,
  findOne,
} from './operations'

import {
  Maybe,
  ResolverFactory,
} from '@currentdesk/prismatize'
import {
  unwrap,
} from '@currentdesk/graphql-ast'

export class MongoDBQueryResolverFactory extends ResolverFactory {
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
          directives,
        }
      ) => {
        const {
          list,
          namedType,
        } = unwrap(type)
        const collection = tableize(namedType.name.value)

        resolvers[name] = list ? find(collection) : findOne(collection)

        return resolvers
      }, {})
    }
  }
}
