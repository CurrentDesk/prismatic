import {
  parse,
  DocumentNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'
import { GraphQLSchema } from 'graphql/type'

import {
  ListType,
  NamedType,
  NonNullType,
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'

import { buildCreateManyInput } from './build-create-many-input'

let gql
let document: DocumentNode
let schema: GraphQLSchema

describe('buildCreateManyInput', () => {
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
        return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Comment'
      })
      const expected: InputObjectTypeDefinitionNode = new InputObjectTypeDefinition()
      .name('CommentCreateManyInput')
      .description('`Comment` create many definition')
      .fields(() => [
        new InputValueDefinition()
        .name('create')
        .type(ListType.node(NonNullType.node(NamedType.node('CommentCreateInput'))))
        .node(),
        new InputValueDefinition()
        .name('connect')
        .type(ListType.node(NonNullType.node(NamedType.node('CommentWhereUniqueInput'))))
        .node()
      ])
      .node()
      const inputObjectTypeDefinition = buildCreateManyInput(given as ObjectTypeDefinitionNode, schema)

      expect(inputObjectTypeDefinition).toEqual(expected)
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

    it('should not build anything', () => {
      const given = document.definitions.find(definition => {
        return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Comment'
      })
      const inputObjectTypeDefinition = buildCreateManyInput(given as ObjectTypeDefinitionNode, schema)

      expect(inputObjectTypeDefinition).toBeUndefined()
    })
  })
})
