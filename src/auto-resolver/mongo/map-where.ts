import { ObjectID } from 'mongodb'

import { Where } from '..'
import { MongoWhere } from '.'

export function mapWhere(where: Where): MongoWhere {
  return Object.keys(where).reduce((result, key) => {
    let value = where[key]

    switch (key) {
      case 'AND':
        result.$and = (value || []).map(mapWhere)
        break
      case 'OR':
        result.$or = (value || []).map(mapWhere)
        break
      case 'NOR':
        result.$nor = (value || []).map(mapWhere)
        break
      default:
        let [field, operator] = key.split('_')

        if (field === 'id') {
          field = '_id'

          if (value instanceof Array) {
            value = value.map(id => new ObjectID(id))
          } else {
            value = new ObjectID(value)
          }
        }

        if (!operator) {
          result[field] = value

          return result
        }

        if (!(field in result)) {
          result[field] = {}
        }
        operator = `$${operator}`

        result[field][operator] = value
    }

    return result
  }, {} as MongoWhere)
}
