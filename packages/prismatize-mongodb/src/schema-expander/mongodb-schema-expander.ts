import { SchemaExpander } from '@currentdesk/prismatize'

import { MongoDBNamer } from './mongodb-namer'
import { MongoDBArgumentsBuilder } from './mongodb-arguments-builder'
import { MongoDBFieldBuilder } from './mongodb-field-builder'
import { MongoDBInputBuilder } from './mongodb-input-builder'

export class MongoDBSchemaExpander extends SchemaExpander {
  constructor(models: string) {
    super(models)

    this.namer = new MongoDBNamer()
    this.argumentsBuilder = new MongoDBArgumentsBuilder(
      this.namer,
      this.schema,
    )
    this.fieldBuilder = new MongoDBFieldBuilder(
      this.namer,
      this.argumentsBuilder,
      this.schema,
    )
    this.inputBuilder = new MongoDBInputBuilder(
      this.namer,
      this.fieldBuilder,
      this.schema,
    )
  }
}
