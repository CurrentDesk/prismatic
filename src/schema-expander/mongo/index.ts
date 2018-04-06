import {
  DefinitionNode,
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'

import { SchemaExpander } from '../abstract-schema-expander'

import { buildWhereInput } from './build-where-input'
import { buildOrderByInput } from './build-order-by-input'
import { buildCreateInput } from './build-create-input'
import { buildCreateManyInput } from './build-create-many-input'
import { buildUpdateInput } from './build-update-input'
import { buildUpdateManyInput } from './build-update-many-input'
import { buildQueryType } from './build-query-type'
import { buildMutationType } from './build-mutation-type'
import { buildWhereUniqueInput } from './build-where-unique-input'
import { expandListField } from './expand-list-field'

export class SchemaExpanderMongo extends SchemaExpander {
  public ObjectTypeDefinition(node: ObjectTypeDefinitionNode) {
    [
      buildWhereInput,
      buildOrderByInput,
      buildCreateInput,
      buildCreateManyInput,
      buildUpdateInput,
      buildUpdateManyInput,
      buildWhereUniqueInput,
    ]
    .map(builder => builder(node, this.schema))
    .filter(result => result !== undefined)
    // We have to cast here because TS doesn't realize we're removing the undefined results
    .forEach(definition => this.definitions.push(definition as DefinitionNode))

    buildQueryType(node, this.query)
    buildMutationType(node, this.mutation)

    return node
  }

  public FieldDefinition(node: FieldDefinitionNode) {
    expandListField(node, this.schema)

    return node
  }
}
