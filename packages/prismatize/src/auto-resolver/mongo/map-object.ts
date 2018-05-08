import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isObjectType,
  GraphQLSchema,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import { tableize } from 'inflected'

import {
  unwrap,
  hasDirective,
} from '@currentdesk/graphql-ast'

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
      const collection = tableize(namedType.name.value)

      switch (name) {
        case 'id': {
          if (!hasDirective(fieldDirectives, 'unique')) {
            throw new Error('Field `id` must be marked `@unique`.')
          }

          resolvers.id = (object) => object._id

          break
        }
        default: {
          if (gqlType && isObjectType(gqlType) && !hasDirective(fieldDirectives, 'embedded')) {
            resolvers[name] = (source, args, context, info) => {
              if (list) {
                if (source[name] !== undefined) {
                  Object.assign(args, { where: { id_in: source[name] } })
                  return find(collection)(null, args, context, info)
                } else {
                  return []
                }
              }

              Object.assign(args, { where: { id: source[name] } })
              return findOne(collection)(null, args, context, info)
            }
          }
        }
      }

      return resolvers
    }, {})
  }
}
