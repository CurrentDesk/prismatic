import { FieldDefinitionNode } from 'graphql/language'
import { typeFromAST } from 'graphql/utilities'

import { camelize } from 'inflected'

import {
  unwrap,
  hasDirective,
} from '../../utilities'
import { isObjectType } from '../../type'

import { ResolverMap } from '..'
import { MongoContext } from '.'

import { find } from './find'
import { findOne } from './find-one'

export function mapObject(
  {
    db,
    fields,
    directives,
    schema,
  }: MongoContext
) {
  if (!hasDirective(directives, 'embedded')) {
    return fields.reduce((resolvers: ResolverMap, field: FieldDefinitionNode) => {
      const {
        name: {
          value: name
        },
        type,
      } = field
      const {
        list,
        namedType,
      } = unwrap(type)
      const gqlType = typeFromAST(schema, namedType)
      const collection = camelize(namedType.name.value, false)

      switch (name) {
        case 'id': {
          if (!hasDirective(field.directives, 'unique')) {
            throw new Error('Field `id` must be marked `@unique`.')
          }

          resolvers.id = (object) => object._id

          break
        }
        default: {
          if (!hasDirective(field.directives, 'embedded') && isObjectType(gqlType)) {
            resolvers[name] = (object, args, context, meta) => {
              if (list) {
                if (object[name] !== undefined) {
                  Object.assign(args, { where: { id_in: object[name] } })
                  return find(db, collection)(null, args, context, meta)
                } else {
                  return []
                }
              }

              Object.assign(args, { where: { id: object[name] } })
              return findOne(db, collection)(null, args, context, meta)
            }
          }
        }
      }

      return resolvers
    }, {})
  }
}
