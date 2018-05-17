import {
  parse,
  print,
  visit,
  DocumentNode,
} from 'graphql/language'
import { buildASTSchema } from 'graphql/utilities'
import { GraphQLSchema } from 'graphql/type'

import { ExpansionVisitor } from './expansion-visitor'
import { RelationshipManager } from './relationship-manager'
import { ArgumentsBuilder } from './arguments-builder'
import { FieldBuilder } from './field-builder'
import { InputBuilder } from './input-builder'
import { Namer } from './namer'

export abstract class SchemaExpander {
  protected relationshipManager: RelationshipManager
  protected argumentsBuilder: ArgumentsBuilder
  protected fieldBuilder: FieldBuilder
  protected inputBuilder: InputBuilder
  protected namer: Namer

  protected schema: GraphQLSchema

  private ast: DocumentNode

  public constructor(models: string) {
    this.ast = parse(models, { noLocation: true })
    this.schema = buildASTSchema(this.ast)

    this.relationshipManager = new RelationshipManager(this.schema)
  }

  public expand(): string {
    const expansionVisitor = new ExpansionVisitor(
      this.argumentsBuilder,
      this.fieldBuilder,
      this.inputBuilder,
      this.relationshipManager,
      this.schema,
    )

    return print(visit(this.ast, expansionVisitor))
  }
}
