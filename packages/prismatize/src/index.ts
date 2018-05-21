export * from './schema-expander'
export * from './resolver-factory'
export * from './maybe'

// import {
//   print,
//   DefinitionNode,
// } from 'graphql/language'
//
// import {
//   Document,
//   NamedType,
//   NonNullType,
//   DirectiveDefinition,
//   InputValueDefinition,
// } from './builders'

// export * from './utilities'
// export * from './builders'

// All directives and scalars built into the library
// export const builtIns = print(
//   new Document()
//   .definitions(definitions =>
//     [
//       new DirectiveDefinition()
//       .description('Denotes unique identifiers')
//       .name('unique')
//       .locations([
//         'FIELD_DEFINITION',
//       ])
//       .node() as DefinitionNode,
//       new DirectiveDefinition()
//       .description('Denotes embedded entities')
//       .name('embedded')
//       .locations([
//         'OBJECT',
//         'FIELD_DEFINITION',
//       ])
//       .node(),
//       new DirectiveDefinition()
//       .description('Denotes default value')
//       .name('default')
//       .arguments(() => [
//         new InputValueDefinition()
//         .name('value')
//         .type(
//           new NonNullType()
//           .type(
//             new NamedType()
//             .name('String')
//             .node()
//           )
//           .node()
//         )
//         .node()
//       ])
//       .locations([
//         'FIELD_DEFINITION',
//       ])
//       .node(),
//     ].concat(definitions)
//   )
//   .node()
// )
