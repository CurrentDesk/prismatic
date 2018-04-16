import {
  ObjectTypeDefinitionNode,
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
} from 'graphql/language'
import { typeFromAST } from 'graphql/utilities'
import {
  getNamedType,
  isInputType,
  GraphQLSchema,
} from 'graphql/type'

import {
  EnumTypeDefinition,
  EnumValueDefinition,
} from '../../builders'

export const orderByInputName = (name: string) => `${name}OrderByInput`

export function buildOrderByInput(
  {
    name: {
      value: name
    },
    fields
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): EnumTypeDefinitionNode {
  return new EnumTypeDefinition()
  .name(orderByInputName(name))
  .description(`\`${name}\` order by options definition`)
  .values(
    (fields || [])
    .filter(field => {
      const type = getNamedType(typeFromAST(schema, field.type as any) as any) // I don't even get it...

      return type && isInputType(type)
    })
    .reduce((values, field) => {
      const name = field.name.value

      return values.concat([
        new EnumValueDefinition().name(`${name}_ASC`).node(),
        new EnumValueDefinition().name(`${name}_DESC`).node(),
      ])
    }, [] as EnumValueDefinitionNode[])
  )
  .node()
}
