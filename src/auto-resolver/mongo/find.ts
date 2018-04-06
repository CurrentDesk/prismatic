import { GraphQLResolveInfo } from 'graphql/type'
import { Db } from 'mongodb'

import { Arguments } from '..'
import { MongoWhere } from '.'

import { mapWhere } from './map-where'
import { mapOrderBy } from './map-order-by'
import { getProjection } from './get-projection'

export function find(db: Promise<Db>, collectionName: string) {
  return (
    object,
    {
      where,
      orderBy,
      skip,
      first,
      last,
    }: Arguments,
    context,
    meta: GraphQLResolveInfo,
  ) => db.then(db => {
    const condition: MongoWhere = where ? mapWhere(where) : {}
    const collection = db.collection(collectionName)
    const count = last ? collection.count({}) : Promise.resolve(0)
    const projection = getProjection(meta)

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
