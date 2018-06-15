import {
  TypeNode,
  VariableDefinitionNode,
  InputValueDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isInputObjectType,
  GraphQLSchema,
  GraphQLResolveInfo,
  GraphQLFieldResolver,
  GraphQLInputObjectType
} from 'graphql/type'
import { tableize } from 'inflected'
import { is } from 'ramda'

import { getNamedType } from '@currentdesk/graphql-ast'
import { RelationshipManager } from '@currentdesk/prismatize'

import { MongoDBContext } from '../mongodb-context'

import {
  mapWhere,
  getCollectionName,
} from './helpers'

export interface ManyArgs {
  data: object[]
}

function fieldsOfInput(type: TypeNode, schema: GraphQLSchema) {
  const {
    name: {
      value: name
    }
  } = getNamedType(type)
  const gqlType = schema.getType(name)
  if (gqlType && ((process.env.NODE_ENV === 'production' && isInputObjectType(gqlType)) || gqlType.constructor.name === GraphQLInputObjectType.name)) {
    const { astNode } = gqlType
    const { fields } = astNode as InputObjectTypeDefinitionNode

    return fields
  }
}

export function insertMany(
  relatedModelName: string,
  relationshipManager: RelationshipManager,
): GraphQLFieldResolver<object, MongoDBContext, ManyArgs> {
  const collectionName = getCollectionName(relatedModelName)

  return (
    source,
    { data },
    { db },
    {
      schema,
      operation: {
        variableDefinitions,
      },
    }: GraphQLResolveInfo
  ) => {
    const relatives: {
      toOnes: string[],
      toManys: { key: string, value: any }[]
    }[] = []
    data.forEach(item => {
      const toOnes: string[] = []
      const toManys: { key: string, value: any }[] = []
      Object.entries(item).forEach(([key, value]) => {
        if (value != null && (value.create != null || value.connect != null)) {
          if (is(Array, value)) {
            toManys.push({ key, value })
            delete item[key]
          } else {
            if ('create' in value && 'connect' in value) {
              throw new Error('Cannot specify `create` and `connect` in a to-one relationship')
            }

            toOnes.push(key)
          }
        }
      })
      relatives.push({ toOnes, toManys })
    })

    return db.then(db => {
      relatives.forEach(item => {
        const queries = item.toOnes.map(key => {
          data.forEach(x => {
            const value = x[key]
            const [{ type }] = variableDefinitions as VariableDefinitionNode[]
            const fields = fieldsOfInput(type, schema)

            if (fields) {
              const { type } = fields.find(field => field.name.value === key) as InputValueDefinitionNode
              const { name: { value: name } } = getNamedType(type)
              const [match] = name.match(/^[A-Z][a-z]+/) as string[]
              const collection = db.collection(tableize(match))

              if ('create' in value) {
                const { create } = value

                return collection.insertOne(mapWhere(create)).then(({ insertedId }) => {
                  x[key] = insertedId
                })
              }

              if ('connect' in value) {
                const { connect } = value

                return collection.findOne(mapWhere(connect)).then(({ _id }) => {
                  x[key] = _id
                })
              }
            } else {
              throw new Error(`Schema is missing fields for ${relatedModelName}`)
            }
          })
          return Promise.all(queries)
            .then(() => {
              const collection = db.collection(collectionName)

              // data['createdAt'] = new Date(Date.now())
              // data['updatedAt'] = new Date(Date.now())

              data.forEach(x => {
                data['createdAt'] = new Date(Date.now())
                data['updatedAt'] = new Date(Date.now())
              })

              // console.log('data:', JSON.stringify(data, null, 2))
              return collection.insertMany(data)
                .then(({
                  insertedIds,
                  ops: [result]
                }) => {
                  Object.values(insertedIds).forEach((insertedId, index) => {
                    console.log(result)
                    const queries = relatives[index].toManys.map(({ key, value }) => {
                      const [{ type }] = variableDefinitions as VariableDefinitionNode[]
                      const fields = fieldsOfInput(type, schema)

                      if (fields) {
                        const { type } = fields.find(field => field.name.value === key) as InputValueDefinitionNode
                        const { name: { value: name } } = getNamedType(type)
                        const [match] = name.match(/^[A-Z][a-z]+/) as string[]
                        const collection = db.collection(tableize(match))

                        if ('create' in value) {
                          let { create } = value

                          create = create.map(item => {
                            Object.keys(item).forEach(related => {
                              const relationship = relationshipManager.findRelationship(name, relatedModelName)

                              if (relationship) {
                                const { fieldName } = relationship

                                item[related][fieldName] = insertedId
                              }
                            })
                          })
                            .map(mapWhere)

                          return collection.insertMany(create).then(({ insertedIds, insertedCount }) => {
                            data[key] = insertedId
                          })
                        }

                        if ('connect' in value) {
                          const { connect } = value

                          return collection.findOne(connect.map(mapWhere)).then(({ _id }) => {
                            data[key] = _id
                          })
                        }
                      } else {
                        throw new Error(`Schema is missing fields for ${relatedModelName}`)
                      }
                    })

                    return Promise.all(queries).then(() => result)
                  })
                })
                .catch(console.log)
            })
        })
      })
    })
  }
}
