import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isInputType,
  GraphQLSchema,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  NamedType,
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'
import {
  unwrap,
  hasDirective,
} from '../../utilities'

import { updateManyInputName } from './build-update-many-input'

export const updateInputName = (name: string) => `${name}UpdateInput`

export function buildUpdateInput(
  {
    name: {
      value: name,
    },
    fields,
    directives: objectTypeDirectives,
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode {
  return new InputObjectTypeDefinition()
  .name(updateInputName(name))
  .description(`\`${name}\` update definition`)
  .fields(() =>
    (fields || []).reduce((
      fields,
      {
        name: {
          value: name,
        },
        type,
        directives,
      }: FieldDefinitionNode
    ) => {
      if (!hasDirective(objectTypeDirectives, 'embedded') && ['id', 'createdAt', 'updatedAt'].includes(name)) {
        // These are handled internally
        return fields
      }

      const { namedType, list } = unwrap(type)

      if (hasDirective(directives, 'embedded')) {
        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(NamedType.node(list ? updateManyInputName(namedType.name.value) : updateInputName(namedType.name.value)))
          .node()
        )
      }

      const gqlType = typeFromAST(schema, namedType)

      if (gqlType && isInputType(gqlType)) {
        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(namedType)
          .node()
        )
      }

      return fields
    }, [] as InputValueDefinitionNode[])
  )
  .node()
}
