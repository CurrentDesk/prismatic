import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import {
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'
import { hasDirective } from '../../utilities'

export const whereUniqueInputName = (name: string) => `${name}WhereUniqueInput`

export function buildWhereUniqueInput(
  {
    name: {
      value: name,
    },
    fields,
    directives,
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode | undefined {
  const fieldDefinitions = (fields || [])
  .filter(({ directives }: FieldDefinitionNode) => hasDirective(directives, 'unique'))
  .map((field: FieldDefinitionNode) => InputValueDefinition.fromFieldDefinition(field).node())

  if (fieldDefinitions.length > 0) {
    return new InputObjectTypeDefinition()
    .name(whereUniqueInputName(name))
    .description(`\`${name}\` unique filter definition`)
    .fields(_ => fieldDefinitions)
    .node()
  }
}
