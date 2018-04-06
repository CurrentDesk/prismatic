import {
  DocumentNode,
  DefinitionNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'

import {
  Document,
  ObjectTypeDefinition,
} from '../builders'

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
  public InputObjectTypeDefinition() { return undefined }
  public ObjectTypeExtension() { return undefined }
  public InterfaceTypeExtension() { return undefined }
  public UnionTypeExtension() { return undefined }
  public EnumTypeExtension() { return undefined }

  private build(node: DocumentNode) {
    return new Document(node)
    .definitions(definitions =>
      definitions.concat(
        this.definitions,
        this.query.node(),
        this.mutation.node(),
      )
    )
    .node()
  }
}
