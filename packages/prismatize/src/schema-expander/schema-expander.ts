import {
  parse,
  print,
  visit,
  DocumentNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { buildASTSchema } from 'graphql/utilities'

import { RelationshipManager } from '../relationship-manager'

import { ExpansionVisitor } from './expansion-visitor'
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
    const visitor = new ExpansionVisitor(
      this.argumentsBuilder,
      this.fieldBuilder,
      this.inputBuilder,
      this.relationshipManager,
    )

    return print(visit(this.ast, visitor))
  }
}
