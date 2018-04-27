import { GraphQLResolveInfo } from 'graphql/type'

import { Arguments } from '../..'
import { MongoWhere } from '../.'

import { mapWhere } from './helpers/map-where'
import { mapOrderBy } from './helpers/map-order-by'
import { getProjection } from './helpers/get-projection'

export function find(collectionName: string) {
  return (
    source,
    {
      where,
      orderBy,
      skip,
      first,
      last,
    }: Arguments,
    { db },
    info: GraphQLResolveInfo,
  ) => db.then(db => {
    const condition: MongoWhere = where ? mapWhere(where) : {}
    const collection = db.collection(collectionName)
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
