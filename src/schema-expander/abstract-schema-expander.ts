import {
  DocumentNode,
  DefinitionNode,
  TypeDefinitionNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import {
  Document,
  ObjectTypeDefinition,
} from '../builders'

const definitionOrder = [
  'ScalarTypeDefinition',
  'DirectiveDefinition',
  'InterfaceTypeDefinition',
  'ObjectTypeDefinition',
]

export abstract class SchemaExpander {
  public Document: any = {}

  protected definitions: DefinitionNode[]
  protected query: ObjectTypeDefinition
  protected mutation: ObjectTypeDefinition

  public constructor(protected schema: GraphQLSchema) {
    this.definitions = []
    this.query = new ObjectTypeDefinition().name('Query')
    this.mutation = new ObjectTypeDefinition().name('Mutation')

    this.Document.leave = this.build
  }

  public abstract ObjectTypeDefinition(node: ObjectTypeDefinitionNode)
  public abstract FieldDefinition(node: FieldDefinitionNode)

  // These are all the things that will be dropped if encountered
  public InputObjectTypeDefinition() { return null }
  public ObjectTypeExtension() { return null }
  public InterfaceTypeExtension() { return null }
  public UnionTypeExtension() { return null }
  public EnumTypeExtension() { return null }

  private build(node: DocumentNode) {
    return new Document(node)
    .definitions(definitions =>
      definitions.sort((a: TypeDefinitionNode, b: TypeDefinitionNode) => {
        const aIndex = definitionOrder.indexOf(a.kind)
        const bIndex = definitionOrder.indexOf(b.kind)

        if (aIndex < 0) {
          return 1
        }

        if (bIndex < 0) {
          return -1
        }

        if (aIndex === bIndex) {
          const aName = a.name.value.toUpperCase()
          const bName = b.name.value.toUpperCase()

          return aName < bName ? -1 : 1
        }

        return aIndex - bIndex
      })
      .concat(
        this.definitions.sort((a: TypeDefinitionNode, b: TypeDefinitionNode) => {
          const aName = a.name.value.toUpperCase()
          const bName = b.name.value.toUpperCase()

          return aName < bName ? -1 : 1
        }),
        this.query.node(),
        this.mutation.node(),
      )
    )
    .node()
  }
}
