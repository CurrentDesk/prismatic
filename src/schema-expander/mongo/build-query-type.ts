import { ObjectTypeDefinitionNode } from 'graphql/language'

import {
  singularize,
  pluralize,
  camelize,
} from 'inflected'

import {
  ListType,
  NamedType,
  NonNullType,
  FieldDefinition,
  ObjectTypeDefinition,
} from '../../builders'
import { hasDirective } from '../../utilities'

import {
  buildWhereArguments,
  buildWhereUniqueArguments,
} from './build-query-arguments'

export function buildQueryType(
  {
    name: {
      value: name
    },
    directives
  }: ObjectTypeDefinitionNode,
  query: ObjectTypeDefinition,
) {
  if (!hasDirective(directives, 'isEmbedded')) {
    query.fields(fields => {
      const fieldName = camelize(name, false)

      return fields.concat([
        new FieldDefinition()
        .name(pluralize(fieldName))
        .description(`Returns a list of \`${name}\`s that match the filter`)
        .arguments(_ => buildWhereArguments(name))
        .type(
          new NonNullType()
          .type(
            new ListType()
            .type(
              new NamedType()
              .name(name)
              .node()
            )
            .node()
          )
          .node()
        )
        .node(),
        new FieldDefinition()
        .name(singularize(fieldName))
        .description(`Returns a single \`${name}\` record by ID`)
        .arguments(_ => buildWhereUniqueArguments(name))
        .type(
          new NamedType()
          .name(name)
          .node()
        )
        .node(),
      ])
    })
  }
}
