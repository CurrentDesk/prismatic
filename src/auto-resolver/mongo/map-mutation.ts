import { FieldDefinitionNode } from 'graphql/language'
import { camelize } from 'inflected'

import { unwrap } from '../../utilities'

import { ResolverMap } from '..'
import { MongoContext } from '.'

import { insertOne } from './insert-one'
import { updateOne } from './update-one'
import { deleteOne } from './delete-one'

export function mapMutation({
  db,
  fields,
}: MongoContext) {
  return fields.reduce((
    resolvers: ResolverMap,
    {
      name: { value: name },
      type,
    }: FieldDefinitionNode
  ) => {
    const { namedType } = unwrap(type)
    const collection = camelize(namedType.name.value, false)
    const match = name.match(/^([^A-Z]+)/)

    if (match) {
      const action = match[1]

      switch (action) {
        case 'create': {
          resolvers[name] = insertOne(db, collection)
          break
        }
        case 'update': {
          resolvers[name] = updateOne(db, collection)
          break
        }
        case 'delete': {
          resolvers[name] = deleteOne(db, collection)
          break
        }
        default: {
          throw new Error('Unknown action')
        }
      }
    }

    return resolvers
  }, {})
}
