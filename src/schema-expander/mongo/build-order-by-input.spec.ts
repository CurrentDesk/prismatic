import {
  parse,
  DocumentNode,
  EnumTypeDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'
import { GraphQLSchema } from 'graphql/type'

import {
  EnumTypeDefinition,
  EnumValueDefinition,
} from '../../builders'

import { buildOrderByInput } from './build-order-by-input'

let gql: string
let document: DocumentNode
let schema: GraphQLSchema

describe('buildOrderByInput', () => {
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

    it('should build an EnumTypeDefinitionNode given an ObjectTypeDefinitionNode', () => {
      const given = document.definitions.find(definition => {
        return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Post'
      })
      const expected: EnumTypeDefinitionNode = new EnumTypeDefinition()
      .description('`Post` order by options definition')
      .name('PostOrderByInput')
      .values(() => [
        new EnumValueDefinition().name('id_ASC').node(),
        new EnumValueDefinition().name('id_DESC').node(),
        new EnumValueDefinition().name('isPublished_ASC').node(),
        new EnumValueDefinition().name('isPublished_DESC').node(),
        new EnumValueDefinition().name('title_ASC').node(),
        new EnumValueDefinition().name('title_DESC').node(),
        new EnumValueDefinition().name('text_ASC').node(),
        new EnumValueDefinition().name('text_DESC').node(),
      ])
      .node()
      const result = buildOrderByInput(given as ObjectTypeDefinitionNode, schema)

      expect(result).toEqual(expected)
    })
  })

  describe('embedded', () => {
    beforeAll(() => {
      gql = `
        type Post {
          id: ID! @unique
          isPublished: Boolean! @default(value: "false")
          title: String!
          text: String!
          comments: [Comment!]! @embedded
        }

        type Comment @embedded {
          id: ID! @unique
          name: String!
          text: String!
        }
      `
    })

    it('should build an EnumTypeDefinitionNode given an ObjectTypeDefinitionNode', () => {
      const given = document.definitions.find(definition => {
        return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Post'
      })
      const expected: EnumTypeDefinitionNode = new EnumTypeDefinition()
      .description('`Post` order by options definition')
      .name('PostOrderByInput')
      .values(() => [
        new EnumValueDefinition().name('id_ASC').node(),
        new EnumValueDefinition().name('id_DESC').node(),
        new EnumValueDefinition().name('isPublished_ASC').node(),
        new EnumValueDefinition().name('isPublished_DESC').node(),
        new EnumValueDefinition().name('title_ASC').node(),
        new EnumValueDefinition().name('title_DESC').node(),
        new EnumValueDefinition().name('text_ASC').node(),
        new EnumValueDefinition().name('text_DESC').node(),
      ])
      .node()
      const result = buildOrderByInput(given as ObjectTypeDefinitionNode, schema)

      expect(result).toEqual(expected)
    })
  })
})
