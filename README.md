# Prismatize
A node library that converts your database into a GraphQL API like Prisma.

## CLI Usage
```shell
npx prismatize expand ./input.graphql [./output.graphql]
```

## Import Examples

### MongoDb with Resolver Mapping
```typescript
import {
  expandSchema,
  mapResolvers,
} from 'prismatize'

// Using `graphql-import-loader`
import types from './schema/index.graphql'

const typeDefs = expandSchema(types, 'mongo')
const resolvers = mapResolvers(typeDefs, {
  type: 'mongo',
  uri: '', // database connection uri
  database: '', // database name
})
```

### Serverless Lambda with GraphQL-Yoga and MongoDb Resolver Mapping
```typescript
import {
  APIGatewayEvent,
  Callback,
  Context,
  Handler
} from 'aws-lambda'
import { GraphQLServerLambda } from 'graphql-yoga'

import {
  expandSchema,
  mapResolvers,
} from 'prismatize'

// Using `graphql-import-loader`
import types from './schema/index.graphql'

const typeDefs = expandSchema(types, 'mongo')
const resolvers = mapResolvers(typeDefs, {
  type: 'mongo',
  uri: '', // database connection uri
  database: '', // database name
})

const yogaLambda = new GraphQLServerLambda({
  typeDefs,
  resolvers,
})

export const graphql: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  // allows function to re-use mongo connection for other events processed by this instance
  // https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs
  context.callbackWaitsForEmptyEventLoop = false

  return yogaLambda.graphqlHandler(event, context, callback)
}

export const playground: Handler = (event: APIGatewayEvent, context: Context, callback: Callback) => {
  return yogaLambda.playgroundHandler(event, context, callback)
}
```
