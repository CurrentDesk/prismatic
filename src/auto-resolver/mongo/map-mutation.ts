import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { camelize } from 'inflected'

import { unwrap } from '../../utilities'

import { ResolverMap } from '..'

import { insertOne } from './operations/insert-one'
import { updateOne } from './operations/update-one'
import { deleteOne } from './operations/delete-one'

export function mapMutation({ fields }: ObjectTypeDefinitionNode) {
  return fields && fields.reduce((
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
          resolvers[name] = insertOne(collection)
          break
        }
        case 'update': {
          resolvers[name] = updateOne(collection)
          break
        }
        case 'delete': {
          resolvers[name] = deleteOne(collection)
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
