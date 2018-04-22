import {
  parse,
  DocumentNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'

import {
  NamedType,
  NonNullType,
  FieldDefinition,
  ObjectTypeDefinition,
  InputValueDefinition,
} from '../../builders'

import { buildMutationType } from './build-mutation-type'

let gql
let document: DocumentNode
let mutation: ObjectTypeDefinition

describe('buildMutationType', () => {
  beforeEach(() => {
    document = parse(gql, { noLocation: true })
    mutation = new ObjectTypeDefinition().name('Mutation')
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

    it('should build a FieldDefinitionNode given an ObjectTypeDefinitionNode', () => {
      const given = document.definitions.find(definition => {
        return definition.kind === 'ObjectTypeDefinition' && definition.name.value === 'Post'
      })
      const expected: ObjectTypeDefinitionNode = new ObjectTypeDefinition()
      .name('Mutation')
      .fields(() => [
        new FieldDefinition()
        .name('createPost')
        .description('Creates a new `Post` record')
        .arguments(() => [
          new InputValueDefinition()
          .name('data')
          .type(NonNullType.node(NamedType.node('PostCreateInput')))
          .node()
        ])
        .type(NonNullType.node(NamedType.node('Post')))
        .node(),
        new FieldDefinition()
        .name('updatePost')
        .description('Updates a uniquely identified `Post` record')
        .arguments(() => [
          new InputValueDefinition()
          .name('data')
          .type(NonNullType.node(NamedType.node('PostUpdateInput')))
          .node(),
          new InputValueDefinition()
          .name('where')
          .type(NonNullType.node(NamedType.node('PostWhereUniqueInput')))
          .node(),
        ])
        .type(NamedType.node('Post'))
        .node(),
        new FieldDefinition()
        .name('deletePost')
        .description('Deletes a uniquely identified `Post` record')
        .arguments(() => [
          new InputValueDefinition()
          .name('where')
          .type(NonNullType.node(NamedType.node('PostWhereUniqueInput')))
          .node(),
        ])
        .type(NamedType.node('Post'))
        .node(),
      ])
      .node()

      buildMutationType(given as ObjectTypeDefinitionNode, mutation)

      expect(mutation.node()).toEqual(expected)
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
      const expected: ObjectTypeDefinitionNode = new ObjectTypeDefinition()
      .name('Mutation')
      .node()

      buildMutationType(given as ObjectTypeDefinitionNode, mutation)

      expect(mutation.node()).toEqual(expected)
    })
  })
})
