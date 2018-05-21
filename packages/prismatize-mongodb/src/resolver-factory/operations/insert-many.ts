import { GraphQLResolveInfo } from 'graphql/type'
import { IFieldResolver } from 'graphql-tools'

import { MongoDBContext } from '../mongodb-context'

interface InsertManyArguments {
  data: any[]
}

export function insertMany(collectionName: string): IFieldResolver<any, MongoDBContext> {
  return (
    source,
    {
      data,
    }: InsertManyArguments,
    {
      db,
    }: MongoDBContext,
    info: GraphQLResolveInfo,
  ) => db
  .then(db => db.collection(collectionName))
  .then(collection => collection.insertMany(data))
  .then(({ insertedCount }) => insertedCount)
}
