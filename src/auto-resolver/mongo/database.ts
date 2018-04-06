import { MongoClient, Db } from 'mongodb'

export function connect(uri: string, database: string): Promise<Db> {
  return MongoClient.connect(uri).then(client => client.db(database))
}
