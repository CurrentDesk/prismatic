import { GraphQLResolveInfo } from 'graphql/type'

import { mapWhere } from './helpers/map-where'

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object
}

function mapOperators(data: { [key: string]: any }): { [key: string]: any } {
  return Object.entries(data).reduce((result, [key, value]) => {
    let operator = '$set'

    if (isObject(value)) {
      const keys = Object.keys(value)
      const operatorKey = keys.find(key => ['addToSet', 'pop', 'pull', 'push'].includes(key))

      if (operatorKey) {
        if (keys.length > 1) {
          throw new Error('Too many operators! (╯°□°）╯︵ ┻━┻')
        }

        switch (operatorKey) {
          case 'addToSet':
          case 'push': {
            value = {
              $each: value[operatorKey] // 🍔 value meal
            }
            break
          }
          case 'pop': {
            if (![-1, 1].includes(value[operatorKey])) {
              throw new Error('Must choose a side! ┻━┻ ︵ヽ(`Д´)ﾉ︵﻿ ┻━┻')
            }
            break
          }
        }

        operator = `$${operatorKey}`
      }
    }

    if (result[operator] === undefined) {
      result[operator] = {}
    }

    result[operator][key] = value

    return result
  }, {})
}

export function updateOne(collectionName: string) {
  return (
    object,
    {
      data,
      where,
    },
    { db },
    meta: GraphQLResolveInfo
  ) => db.then(db => {
    const collection = db.collection(collectionName)
    const condition = mapWhere(where)

    data['updatedAt'] = new Date(Date.now())

    data = mapOperators(data)

    return collection.findOneAndUpdate(condition, data, { returnOriginal: false })
    .then(({ value }) => value)
    .catch(console.log)
  })
}
