import { Db } from 'mongodb'

export interface MongoDBContext {
  db: Promise<Db>
}
