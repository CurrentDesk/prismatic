import { GraphQLResolveInfo } from 'graphql/type'
import { Db } from 'mongodb'

import { Arguments } from '..'
import { MongoWhere } from '.'

import { mapWhere } from './map-where'
import { getProjection } from './get-projection'

export function findOne(db: Promise<Db>, collectionName: string) {
  return (
    object,
    {
      where
    }: Arguments,
    context,
    meta: GraphQLResolveInfo,
  ) => db.then(db => {
    const condition: MongoWhere = where ? mapWhere(where) : {}
    const collection = db.collection(collectionName)
    const projection = getProjection(meta)

    return collection.findOne(condition, { projection })
    .catch(console.log)
  })
}
