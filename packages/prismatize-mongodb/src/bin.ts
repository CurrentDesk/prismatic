import { writeFile } from 'fs'
import { resolve } from 'path'

import * as program from 'commander'
import { importSchema } from 'graphql-import'
import { GraphQLServer } from 'graphql-yoga'

import { MongoDBSchemaExpander } from './schema-expander'
import { MongoDBAutoExecutableSchemaFactory } from './resolver-factory'

process.title = 'pzmongo'

program
.command('expand <input>')
.option('-o, --output <output>', 'Output to a file.')
.action((input, options) => {
  const models = importSchema(input)
  const typeDefs = new MongoDBSchemaExpander(models).expand()

  if (options.output) {
    writeFile(
      resolve(options.output),
      typeDefs,
      'utf8',
      error => { if (error) throw error }
    )
  } else {
    console.log(typeDefs)
  }
})

program
.command('serve <input>')
.action((input) => {
  const models = importSchema(input)
  const typeDefs = new MongoDBSchemaExpander(models).expand()
  const schema = new MongoDBAutoExecutableSchemaFactory(typeDefs).makeExecutableSchema()
  const server = new GraphQLServer({ schema })

  server.start(() => console.log('Server is running on localhost:4000'))
})

program.parse(process.argv)
