import { GraphQLResolveInfo } from 'graphql/type'
import { IFieldResolver } from 'graphql-tools'

import { Arguments } from '@currentdesk/prismatize'

import { MongoDBWhere } from '../mongodb-where'
import { MongoDBContext } from '../mongodb-context'

import {
  mapWhere,
  mapOrderBy,
  getProjection,
} from './helpers'

export function find(collectionName: string): IFieldResolver<any, MongoDBContext> {
  return (
    source,
    {
      where,
      orderBy,
      skip,
      first,
      last,
    }: Arguments,
    {
      db,
    }: MongoDBContext,
    info: GraphQLResolveInfo,
  ) => db
  .then(db => db.collection(collectionName))
  .then(collection => {
    const condition: MongoDBWhere = where ? mapWhere(where) : {}
    const count = last ? collection.count({}) : Promise.resolve(0)
    const projection = getProjection(info)

    return count.then(count => {
      let query = collection.find(condition).project(projection)

      if (orderBy) {
        const [field, order] = mapOrderBy(orderBy)

        query = query.sort(field, order)
      }

      if (last && last <= count) {
        let to = last

        if (skip) {
          to += skip
        }

        query = query.skip(count - to).limit(last)
      } else {
        if (skip) {
          query = query.skip(skip)
        }

        if (first) {
          query = query.limit(first)
        }
      }

      return query.toArray()
    })
  })
  .catch(console.log) // FIXME: ???
}
