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
  if (!hasDirective(directives, 'isEmbedded')) {
    mutation.fields(fields =>
      fields.concat([
        new FieldDefinition()
        .name(`create${name}`)
        .description(`Creates a new \`${name}\` record`)
        .arguments(_ =>
          [
            new InputValueDefinition()
            .name('data')
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
          ]
        )
        .type(
          new NonNullType()
          .type(
            new NamedType()
            .name(name)
            .node()
          )
          .node()
        )
        .node(),
        new FieldDefinition()
        .name(`update${name}`)
        .description(`Updates a uniquely identified \`${name}\` record`)
        .arguments(_ =>
          [
            new InputValueDefinition()
            .name('data')
            .type(
              new NonNullType()
              .type(
                new NamedType()
                .name(updateInputName(name))
                .node()
              )
              .node()
            )
            .node(),
            new InputValueDefinition()
            .name('where')
            .type(
              new NonNullType()
              .type(
                new NamedType()
                .name(whereUniqueInputName(name))
                .node()
              )
              .node()
            )
            .node()
          ]
        )
        .type(
          new NamedType()
          .name(name)
          .node()
        )
        .node(),
        new FieldDefinition()
        .name(`delete${name}`)
        .description(`Deletes a uniquely identified \`${name}\` record`)
        .arguments(_ =>
          [
            new InputValueDefinition()
            .name('where')
            .type(
              new NonNullType()
              .type(
                new NamedType()
                .name(whereUniqueInputName(name))
                .node()
              )
              .node()
            )
            .node()
          ]
        )
        .type(
          new NamedType()
          .name(name)
          .node()
        )
        .node()
      ])
    )
  }
}
