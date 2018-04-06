import {
  print,
  DefinitionNode,
} from 'graphql/language'

import {
  Document,
  NamedType,
  NonNullType,
  DirectiveDefinition,
  ScalarTypeDefinition,
  InputValueDefinition,
} from './builders'

export * from './schema-expander'
export * from './auto-resolver'

// All directives and scalars built into the library
export const builtIns = print(
  new Document()
  .definitions(definitions =>
    [
      new DirectiveDefinition()
      .description('Denotes unique identifiers')
      .name('unique')
      .locations([
        'FIELD_DEFINITION',
      ])
      .node() as DefinitionNode,
      new DirectiveDefinition()
      .description('Denotes embedded entities')
      .name('embedded')
      .locations([
        'OBJECT',
        'FIELD_DEFINITION',
      ])
      .node(),
      new DirectiveDefinition()
      .description('Denotes default value')
      .name('default')
      .arguments(() => [
        new InputValueDefinition()
        .name('value')
        .type(
          new NonNullType()
          .type(
            new NamedType()
            .name('Any')
            .node()
          )
          .node()
        )
        .node()
      ])
      .locations([
        'FIELD_DEFINITION',
      ])
      .node(),
      new ScalarTypeDefinition()
      .description('Support for mixed types')
      .name('Any')
      .node(),
    ].concat(definitions)
  )
  .node()
)
