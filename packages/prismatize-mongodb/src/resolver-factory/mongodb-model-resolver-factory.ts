import { ObjectTypeDefinitionNode } from 'graphql/language'
import { typeFromAST } from 'graphql/utilities'
import { isObjectType } from 'graphql/type'
import { IResolverObject } from 'graphql-tools'
import { tableize } from 'inflected'

import {
  Maybe,
  ResolverFactory,
} from '@currentdesk/prismatize'
import {
  unwrap,
  hasDirective,
} from '@currentdesk/graphql-ast'

import {
  find,
  findOne,
} from './operations'

export class MongoDBModelResolverFactory extends ResolverFactory {
  public build(
    {
      name: {
        value: modelName
      },
      fields,
      directives: modelDirectives,
    }: ObjectTypeDefinitionNode
  ): Maybe<IResolverObject> {
    if (fields) {
      return fields.reduce((
        resolvers: IResolverObject,
        {
          name: {
            value: name,
          },
          type,
          directives,
        }
      ) => {
        const {
          list,
          namedType,
        } = unwrap(type)
        const gqlType = typeFromAST(this.schema, namedType)

        if (gqlType) {
          const collection = tableize(namedType.name.value)

          switch (name) {
            case 'id': {
              if (!hasDirective(modelDirectives, 'embedded')) {
                if (!hasDirective(directives, 'unique')) {
                  throw new Error('Field `id` must be marked `@unique`.')
                }

                resolvers.id = (object) => object._id
              }

              break
            }
            default: {
              if (isObjectType(gqlType) && !hasDirective(directives, 'embedded')) {
                resolvers[name] = (source, args, context, info) => {
                  console.log(name, source[name], source)
                  if (source[name] !== undefined && source[name] !== null) {
                    if (list) {
                      Object.assign(args, { where: { id_in: source[name] } })

                      return find(collection)(null, args, context, info)
                    }

                    Object.assign(args, { where: { id: source[name] } })

                    return findOne(collection)(null, args, context, info)
                  }

                  return list ? [] : null
                }
              }
            }
          }
        } else {
          throw new Error('Field type not found in GraphQLSchema')
        }

        return resolvers
      }, {})
    } else {
      throw new Error('Model ${modelName} has no fields')
    }
  }
}
