import {
  parse,
  print,
  visit,
  DocumentNode,
} from 'graphql/language'
import { buildSchema } from 'graphql/utilities'
import { GraphQLSchema } from 'graphql/type'

import { ExpansionVisitor } from './expansion-visitor'
import { ArgumentsBuilder } from './arguments-builder'
import { FieldBuilder } from './field-builder'
import { InputBuilder } from './input-builder'
import { Namer } from './namer'

export abstract class SchemaExpander {
  protected argumentsBuilder: ArgumentsBuilder
  protected fieldBuilder: FieldBuilder
  protected inputBuilder: InputBuilder
  protected namer: Namer

  protected schema: GraphQLSchema

  private ast: DocumentNode

  public constructor(models: string) {
    this.schema = buildSchema(models)
    this.ast = parse(models, { noLocation: true })
  }

  public expand(models: string): string {
    const expansionVisitor = new ExpansionVisitor(
      this.argumentsBuilder,
      this.fieldBuilder,
      this.inputBuilder,
      this.schema,
    )

    return print(visit(this.ast, expansionVisitor))
  }
}
