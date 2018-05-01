import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { tableize } from 'inflected'

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
    const collection = tableize(namedType.name.value)

    resolvers[name] = list ? find(collection) : findOne(collection)

    return resolvers
  }, {})
}
