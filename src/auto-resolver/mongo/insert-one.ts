import { GraphQLResolveInfo } from 'graphql/type'
import { Db } from 'mongodb'

import { condense } from './condense'

export function insertOne(db: Promise<Db>, collectionName: string) {
  return (
    object,
    {
      data
    },
    context,
    meta: GraphQLResolveInfo
  ) => db.then(db => {
    const collection = db.collection(collectionName)
    const input = condense(data)

    input['createdAt'] = new Date(Date.now())
    input['updatedAt'] = new Date(Date.now())

    return collection.insertOne(input)
    .then(({ ops: [result] }) => result)
    .catch(console.log)
  })
}
