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

import { getNamedType } from '../../../utilities'

import { MongoContext } from '..'

import { mapWhere } from './helpers/map-where'

export interface Args {
  data: object
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

export function insertOne(collectionName: string): GraphQLFieldResolver<object, MongoContext, Args> {
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
  ) => db.then(db => {
    const collection = db.collection(collectionName)
    const [ { type } ] = variableDefinitions as VariableDefinitionNode[]
    const fields = fieldsOfInput(type, schema)

    const queries = Object
    .entries(data)
    .reduce((queries, [key, value]) => {
      if (fields) {
        const { type } = fields.find(field => field.name.value === key) as InputValueDefinitionNode

        {
          const fields = fieldsOfInput(type, schema)

          if (fields) {
            if ('create' in value || 'connect' in value) {
              data[key] = []
            }

            if ('create' in value) {
              const { create } = value
              const { type } = fields.find(field => field.name.value === 'create') as InputValueDefinitionNode
              const { name: { value: name } } = getNamedType(type)
              const [ match ] = name.match(/^[A-Z][a-z]+/) as string[]
              const collection = db.collection(tableize(match))

              const insert = collection.insertMany(create).then(({ insertedIds }) => data[key].splice(-1, 0, insertedIds))

              queries.push(insert)
            }

            if ('connect' in value) {
              const { connect } = value
              const { type } = fields.find(field => field.name.value === 'connect') as InputValueDefinitionNode
              const { name: { value: name } } = getNamedType(type)
              const [ match ] = name.match(/^[A-Z][a-z]+/) as string[]
              const collection = db.collection(tableize(match))

              const finds = connect.map(relation => {
                return collection.findOne(mapWhere(relation)).then(({ _id }) => _id)
              })
              const collect = Promise.all(finds).then(ids => data[key].splice(-1, 0, ids))

              queries.push(collect)
            }
          }
        }
      }

      return queries
    }, [] as Promise<any>[])

    return Promise.all(queries)
    .then(() => {
      data['createdAt'] = new Date(Date.now())
      data['updatedAt'] = new Date(Date.now())

      console.log('data:', JSON.stringify(data, null, 2))
      return collection.insertOne(data)
      .then(({ ops: [result] }) => result)
      .catch(console.log)
    })
  })
}
