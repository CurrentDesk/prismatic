import { ObjectTypeDefinitionNode } from 'graphql/language'

import {
  NamedType,
  NonNullType,
  FieldDefinition,
  ObjectTypeDefinition,
  InputValueDefinition,
} from '../../builders'
import { hasDirective } from '../../utilities'

import { whereUniqueInputName } from './build-where-unique-input'
import { createInputName } from './build-create-input'
import { updateInputName } from './build-update-input'

export function buildMutationType(
  {
    name: {
      value: name
    },
    directives
  }: ObjectTypeDefinitionNode,
  mutation: ObjectTypeDefinition,
) {
  if (!hasDirective(directives, 'embedded')) {
    mutation.fields(fields =>
      fields.concat([
        new FieldDefinition()
        .name(`create${name}`)
        .description(`Creates a new \`${name}\` record`)
        .arguments(() => [
          new InputValueDefinition()
          .name('data')
          .type(NonNullType.node(NamedType.node(createInputName(name))))
          .node()
        ])
        .type(NonNullType.node(NamedType.node(name)))
        .node(),
        new FieldDefinition()
        .name(`update${name}`)
        .description(`Updates a uniquely identified \`${name}\` record`)
        .arguments(() => [
          new InputValueDefinition()
          .name('data')
          .type(NonNullType.node(NamedType.node(updateInputName(name))))
          .node(),
          new InputValueDefinition()
          .name('where')
          .type(NonNullType.node(NamedType.node(whereUniqueInputName(name))))
          .node()
        ])
        .type(NamedType.node(name))
        .node(),
        new FieldDefinition()
        .name(`delete${name}`)
        .description(`Deletes a uniquely identified \`${name}\` record`)
        .arguments(() => [
          new InputValueDefinition()
          .name('where')
          .type(NonNullType.node(NamedType.node(whereUniqueInputName(name))))
          .node()
        ])
        .type(NamedType.node(name))
        .node()
      ])
    )
  }
}
