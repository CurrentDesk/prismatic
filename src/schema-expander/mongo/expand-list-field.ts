import { FieldDefinitionNode } from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import { FieldDefinition } from '../../builders/field-definition'
import { isObjectType } from '../../type'
import { unwrap } from '../../utilities'

import { buildWhereArguments } from './build-query-arguments'

export function expandListField(field: FieldDefinitionNode, schema: GraphQLSchema) {
  const {
    namedType,
    list,
  } = unwrap(field.type)
  const {
    name: {
      value: name,
    },
  } = namedType
  const gqlType = typeFromAST(schema, namedType)

  if (list && isObjectType(gqlType)) {
    new FieldDefinition(field).arguments(() => buildWhereArguments(name))
  }
}
