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
import { whereUniqueInputName } from './build-where-unique-input'

export const createManyInputName = (name: string) => `${name}CreateManyInput`

export function buildCreateManyInput(
  {
    name: {
      value: name,
    },
    directives,
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode | undefined {
  if (!hasDirective(directives, 'embedded')) {
    return new InputObjectTypeDefinition()
    .name(createManyInputName(name))
    .description(`\`${name}\` create many definition`)
    .fields(() => [
      new InputValueDefinition()
      .name('create')
      .type(ListType.node(NonNullType.node(NamedType.node(createInputName(name)))))
      .node(),
      new InputValueDefinition()
      .name('connect')
      .type(ListType.node(NonNullType.node(NamedType.node(whereUniqueInputName(name)))))
      .node(),
    ])
    .node()
  }
}
