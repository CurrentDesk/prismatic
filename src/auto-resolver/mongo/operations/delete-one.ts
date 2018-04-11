import { GraphQLResolveInfo } from 'graphql/type'

export function deleteOne(collectionName: string) {
  return (
    object,
    {
      where, // unique
    },
    { db },
    meta: GraphQLResolveInfo
  ) => db.then(db => {
    const collection = db.collection(collectionName)

    return collection.findOneAndDelete(where)
    .then(({ value }) => value)
    .catch(console.log)
  })
}
