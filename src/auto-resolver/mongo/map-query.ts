import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { camelize } from 'inflected'

import { unwrap } from '../../utilities'

import { ResolverMap } from '..'

import { find } from './operations/find'
import { findOne } from './operations/find-one'

export function mapQuery({ fields }: ObjectTypeDefinitionNode) {
  return fields && fields.reduce((
    resolvers: ResolverMap,
    {
      name: {
        value: name,
      },
      type
    }: FieldDefinitionNode,
  ) => {
    const {
      namedType,
      list,
    } = unwrap(type)
    const collection = camelize(namedType.name.value, false)

    resolvers[name] = list ? find(collection) : findOne(collection)

    return resolvers
  }, {})
}
