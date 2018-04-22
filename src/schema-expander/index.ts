import {
  parse,
  print,
  visit,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'

import { SchemaExpander } from './abstract-schema-expander'
import { SchemaExpanderMongo } from './mongo'

export type Dialect = 'mongo'

export function expandSchema(typeDefs: string, dialect: Dialect): string {
  let expander: SchemaExpander

  switch (dialect) {
    case 'mongo': {
      expander = new SchemaExpanderMongo(buildSchema(typeDefs))
      break
    }
    default: {
      throw new Error('Must specify a valid type')
    }
  }

  const ast = parse(typeDefs, { noLocation: true })
  const expandedAST = visit(ast, expander)

  return print(expandedAST)
}
