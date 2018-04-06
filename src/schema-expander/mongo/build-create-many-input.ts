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
  if (!hasDirective(directives, 'isEmbedded')) {
    return new InputObjectTypeDefinition()
    .name(createManyInputName(name))
    .description(`\`${name}\` create many definition`)
    .fields(() =>
      [
        new InputValueDefinition()
        .name('create')
        .type(
          new ListType()
          .type(
            new NonNullType()
            .type(
              new NamedType()
              .name(createInputName(name))
              .node()
            )
            .node()
          )
          .node()
        )
        .node()
      ]
    )
    .node()
  }
}
