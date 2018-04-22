import {
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import {
  ListType,
  NamedType,
  NonNullType,
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'
import { hasDirective } from '../../utilities'

import { createInputName } from './build-create-input'
import { whereInputName } from './build-where-input'

export const updateManyInputName = (name: string) => `${name}UpdateManyInput`

export function buildUpdateManyInput(
  {
    name: {
      value: name,
    },
    directives,
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode | undefined {
  if (hasDirective(directives, 'embedded')) {
    return new InputObjectTypeDefinition()
    .name(updateManyInputName(name))
    .description(`\`${name}\` update many definition`)
    .fields(() => [
      new InputValueDefinition()
      .name('addToSet')
      .type(ListType.node(NonNullType.node(NamedType.node(createInputName(name)))))
      .node(),
      new InputValueDefinition()
      .name('pop')
      .type(NamedType.node('Int'))
      .node(),
      new InputValueDefinition()
      .name('pull')
      .type(NamedType.node(whereInputName(name)))
      .node(),
      new InputValueDefinition()
      .name('push')
      .type(ListType.node(NonNullType.node(NamedType.node(createInputName(name)))))
      .node()
    ])
    .node()
  }
}
