import { AutoExecutableSchemaFactory } from '@currentdesk/prismatize'

import { MongoDBModelResolverFactory } from './mongodb-model-resolver-factory'
import { MongoDBQueryResolverFactory } from './mongodb-query-resolver-factory'
import { MongoDBMutationResolverFactory } from './mongodb-mutation-resolver-factory'

export class MongoDBAutoExecutableSchemaFactory extends AutoExecutableSchemaFactory {
  public constructor(typeDefs: string) {
    super(typeDefs)

    this.modelResolverFactory = new MongoDBModelResolverFactory(
      this.schema,
      this.relationshipManager,
    )
    this.queryResolverFactory = new MongoDBQueryResolverFactory(
      this.schema,
      this.relationshipManager,
    )
    this.mutationResolverFactory = new MongoDBMutationResolverFactory(
      this.schema,
      this.relationshipManager,
    )
  }
}
