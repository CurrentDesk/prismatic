import { SchemaExpander } from '@currentdesk/prismatize'

import { MongoDBNamer } from './mongodb-namer'
import { MongoDBArgumentsBuilder } from './mongodb-arguments-builder'
import { MongoDBFieldBuilder } from './mongodb-field-builder'
import { MongoDBInputBuilder } from './mongodb-input-builder'

export class MongoDBSchemaExpander extends SchemaExpander {
  constructor(models: string) {
    super(models)

    this.namer = new MongoDBNamer(
      this.relationshipManager
    )
    this.argumentsBuilder = new MongoDBArgumentsBuilder(
      this.schema,
      this.namer,
    )
    this.fieldBuilder = new MongoDBFieldBuilder(
      this.schema,
      this.namer,
      this.argumentsBuilder,
      this.relationshipManager,
    )
    this.inputBuilder = new MongoDBInputBuilder(
      this.schema,
      this.namer,
      this.fieldBuilder,
      this.relationshipManager,
    )
  }
}
