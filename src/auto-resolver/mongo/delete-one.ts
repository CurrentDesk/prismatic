import { GraphQLResolveInfo } from 'graphql/type'
import { Db } from 'mongodb'

export function deleteOne(db: Promise<Db>, collectionName: string) {
  return (
    object,
    {
      where, // unique
    },
    context,
    meta: GraphQLResolveInfo
  ) => db.then(db => {
    const collection = db.collection(collectionName)

    return collection.findOneAndDelete(where)
    .then(({ value }) => value)
    .catch(console.log)
  })
}
