import { writeFile } from 'fs'
import { resolve } from 'path'

import * as program from 'commander'
import { importSchema } from 'graphql-import'

import {
  MongoDBSchemaExpander,
} from './schema-expander'

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

program.parse(process.argv)
