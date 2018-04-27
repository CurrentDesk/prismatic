import {
  parse,
  DocumentNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'

import {
  NamedType,
  NonNullType,
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'

import { buildCreateInput } from './build-create-input'

let gql
let document: DocumentNode
let schema

describe('buildCreateInput', () => {
  beforeEach(() => {
    document = parse(gql, { noLocation: true })
    schema = buildSchema(gql)
  })

  describe('non-embedded', () => {
    beforeAll(() => {
      gql = `
        type Post {
          id: ID! @unique
          isPublished: Boolean! @default(value: "false")
          title: String!
          text: String!
          comments: [Comment!]!
        }

        type Comment {
          id: ID! @unique
          name: String!
          text: String!
        }
      `
    })

    it('should build an InputObjectTypeDefinitionNode given an ObjectTypeDefinitionNode', () => {
      const given = document.definitions.find(definition => {
        return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Post'
      })
      const expected: InputObjectTypeDefinitionNode = new InputObjectTypeDefinition()
      .name('PostCreateInput')
      .description('`Post` create definition')
      .fields(() => [
        new InputValueDefinition()
        .name('isPublished')
        .type(NamedType.node('Boolean'))
        .node(),
        new InputValueDefinition()
        .name('title')
        .type(NonNullType.node(NamedType.node('String')))
        .node(),
        new InputValueDefinition()
        .name('text')
        .type(NonNullType.node(NamedType.node('String')))
        .node(),
        new InputValueDefinition()
        .name('comments')
        .type(NamedType.node('CommentCreateManyInput'))
        .node()
      ])
      .node()
      const inputObjectTypeDefinition = buildCreateInput(given as ObjectTypeDefinitionNode, schema)

      expect(inputObjectTypeDefinition).toEqual(expected)
    })
  })

  xit('should build an InputObjectTypeDefinitionNode given an ObjectTypeDefinitionNode with relations', () => {
    const given = document.definitions.find(definition => {
      return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Post'
    })
    const expected: InputObjectTypeDefinitionNode = new InputObjectTypeDefinition()
    .name('PostCreateInput')
    .description('`Post` create definition')
    .fields(() => [
      new InputValueDefinition()
      .name('author')
      .type(NamedType.node('String'))
      .node(),
      new InputValueDefinition()
      .name('title')
      .type(NamedType.node('String'))
      .node(),
      new InputValueDefinition()
      .name('content')
      .type(NamedType.node('String'))
      .node(),
    ])
    .node()
    const inputObjectTypeDefinition: InputObjectTypeDefinitionNode = buildCreateInput(given as ObjectTypeDefinitionNode, schema)

    expect(inputObjectTypeDefinition).toEqual(expected)
  })
})
