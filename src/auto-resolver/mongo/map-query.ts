import { FieldDefinitionNode } from 'graphql/language'
import { camelize } from 'inflected'

import { unwrap } from '../../utilities'

import { ResolverMap } from '..'
import { MongoContext } from '.'

import { find } from './find'
import { findOne } from './find-one'

export function mapQuery(
  {
    db,
    fields,
  }: MongoContext
) {
  return fields.reduce((resolvers: ResolverMap, field: FieldDefinitionNode) => {
    const {
      type,
      name: { value: name }
    } = field
    const {
      namedType,
      list,
    } = unwrap(type)
    const collection = camelize(namedType.name.value, false)

    resolvers[name] = list ? find(db, collection) : findOne(db, collection)

    return resolvers
  }, {})
}
