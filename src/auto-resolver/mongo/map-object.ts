import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import { camelize } from 'inflected'

import {
  unwrap,
  hasDirective,
} from '../../utilities'
import { isObjectType } from '../../type'

import { ResolverMap } from '..'

import { find } from './operations/find'
import { findOne } from './operations/find-one'

export function mapObject(
  {
    fields,
    directives,
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
) {
  if (!hasDirective(directives, 'embedded')) {
    return fields && fields.reduce((
      resolvers: ResolverMap,
      {
        name: {
          value: name,
        },
        type,
        directives: fieldDirectives,
      }: FieldDefinitionNode,
    ) => {
      const {
        list,
        namedType,
      } = unwrap(type)
      const gqlType = typeFromAST(schema, namedType)
      const collection = camelize(namedType.name.value, false)

      switch (name) {
        case 'id': {
          if (!hasDirective(fieldDirectives, 'unique')) {
            throw new Error('Field `id` must be marked `@unique`.')
          }

          resolvers.id = (object) => object._id

          break
        }
        default: {
          if (!hasDirective(fieldDirectives, 'embedded') && isObjectType(gqlType)) {
            resolvers[name] = (object, args, context, meta) => {
              if (list) {
                if (object[name] !== undefined) {
                  Object.assign(args, { where: { id_in: object[name] } })
                  return find(collection)(null, args, context, meta)
                } else {
                  return []
                }
              }

              Object.assign(args, { where: { id: object[name] } })
              return findOne(collection)(null, args, context, meta)
            }
          }
        }
      }

      return resolvers
    }, {})
  }
}
