export interface MongoDBWhere {
  $and?: MongoDBWhere[]
  $or?: MongoDBWhere[]
  $nor?: MongoDBWhere[]
  $not?: MongoDBWhere
  [key: string]: any
}
