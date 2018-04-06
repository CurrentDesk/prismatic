import {
  parse,
  visit,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'

import { AutoResolver } from './abstract-auto-resolver'
import {
  MongoOptions,
  MongoAutoResolver,
} from './mongo'

export interface Where {
  AND?: Where[]
  OR?: Where[]
  NOR?: Where[]
  NOT?: Where
  [key: string]: any
}

export interface Arguments {
  where?: Where
  orderBy?: string
  skip?: number
  first?: number
  last?: number
}

export type ResolverMap = { [key: string]: any }
export type Options = MongoOptions

export function mapResolvers(typeDefs: string, options: Options) {
  const schema = buildSchema(typeDefs)
  let mapper: AutoResolver

  switch (options.type) {
    case 'mongo': {
      mapper = new MongoAutoResolver(schema, options)
      break
    }
    default: {
      throw new Error('Must use a valid options type')
    }
  }

  const ast = parse(typeDefs)

  visit(ast, mapper)

  return mapper.resolvers
}
