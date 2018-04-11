import { GraphQLResolveInfo } from 'graphql/type'

import { condense } from './helpers/condense'

export function insertOne(collectionName: string) {
  return (
    object,
    {
      data
    },
    { db },
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
