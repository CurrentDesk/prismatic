import { GraphQLResolveInfo } from 'graphql/type'

import { Arguments } from '../..'
import { MongoWhere } from '../.'

import { mapWhere } from './helpers/map-where'
import { getProjection } from './helpers/get-projection'

export function findOne(collectionName: string) {
  return (
    object,
    {
      where
    }: Arguments,
    { db },
    meta: GraphQLResolveInfo,
  ) => db.then(db => {
    const condition: MongoWhere = where ? mapWhere(where) : {}
    const collection = db.collection(collectionName)
    const projection = getProjection(meta)

    return collection.findOne(condition, { projection })
    .catch(console.log)
  })
}
