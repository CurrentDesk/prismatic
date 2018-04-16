import {
  parse,
  visit,
  Visitor,
  ASTNode,
  ASTKindToNode,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'

import { AutoResolver } from './abstract-auto-resolver'
import { MongoAutoResolver } from './mongo'

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
export type ResolverType = 'mongo'

export function mapResolvers(typeDefs: string, type: ResolverType) {
  const schema = buildSchema(typeDefs)
  let mapper: AutoResolver

  switch (type) {
    case 'mongo': {
      mapper = new MongoAutoResolver(schema)
      break
    }
    default: {
      throw new Error('Must use a valid options type')
    }
  }

  const ast = parse(typeDefs)

  visit(ast, mapper as Visitor<ASTKindToNode, ASTNode>)

  return mapper.getResolvers()
}
