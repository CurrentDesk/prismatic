import { GraphQLResolveInfo } from 'graphql/type'

import { Arguments } from '../..'
import { MongoWhere } from '../.'

import { mapWhere } from './helpers/map-where'
import { getProjection } from './helpers/get-projection'

export function findOne(collectionName: string) {
  return (
    source,
    {
      where
    }: Arguments,
    { db },
    info: GraphQLResolveInfo,
  ) => db.then(db => {
    const condition: MongoWhere = where ? mapWhere(where) : {}
    const collection = db.collection(collectionName)
    const projection = getProjection(info)

    return collection.findOne(condition, { projection })
    .catch(console.log)
  })
}
