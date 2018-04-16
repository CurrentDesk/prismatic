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
      value: name
    },
    fields,
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode {
  return new InputObjectTypeDefinition()
  .name(updateInputName(name))
  .description(`\`${name}\` update definition`)
  .fields(_ =>
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
      // These are handled internally
      if (['id', 'createdAt', 'updatedAt'].includes(name)) {
        return fields
      }

      const { namedType, list } = unwrap(type)
      const gqlType = typeFromAST(schema, namedType)

      if (gqlType && isInputType(gqlType)) {
        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(namedType)
          .node()
        )
      }

      if (hasDirective(directives, 'embedded')) {
        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(
            new NamedType()
            .name(list ?
              updateManyInputName(namedType.name.value)
              :
              updateInputName(namedType.name.value)
            )
            .node()
          )
          .node()
        )
      }

      return fields
    }, [] as InputValueDefinitionNode[])
  )
  .node()
}
