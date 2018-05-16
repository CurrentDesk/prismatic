import {
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'

import {
  Relationship,
  InputBuilder,
} from '@currentdesk/prismatize'
import { InputObjectTypeDefinition } from '@currentdesk/graphql-ast'

export class MongoDBInputBuilder extends InputBuilder {
  public buildWhereInput(
    {
      name: {
        value: name,
      },
      fields,
    }: ObjectTypeDefinitionNode
  ): InputObjectTypeDefinitionNode | undefined {
    return new InputObjectTypeDefinition()
    .name(this.namer.buildWhereInputName(name))
    .fields(
      () => [
        ...this.fieldBuilder.buildWhereInputLogicalFields(name),
        ...this.fieldBuilder.buildWhereInputFields(fields || []),
      ]
    )
    .node()
  }

  public buildWhereUniqueInput(
    {
      name: {
        value: name,
      },
      fields,
    }: ObjectTypeDefinitionNode
  ): InputObjectTypeDefinitionNode | undefined {
    const uniqueFields = this.fieldBuilder.buildWhereUniqueInputFields(fields || [])

    if (uniqueFields.length > 0) {
      return new InputObjectTypeDefinition()
      .name(this.namer.buildWhereUniqueInputName(name))
      .fields(() => uniqueFields)
      .node()
    }
  }

  public buildCreateInput(
    {
      name: {
        value: name,
      },
    }: ObjectTypeDefinitionNode
  ): InputObjectTypeDefinitionNode | undefined {
    return new InputObjectTypeDefinition()
    .name(this.namer.buildCreateInputName(name))
    .node()
  }

  public buildUpdateInput(
    {
      name: {
        value: name,
      },
    }: ObjectTypeDefinitionNode
  ): InputObjectTypeDefinitionNode | undefined {
    return new InputObjectTypeDefinition()
    .name(this.namer.buildUpdateInputName(name))
    .node()
  }

  public buildCreateRelationalInput(relationship: Relationship): InputObjectTypeDefinitionNode | undefined {
    if (this.relationshipManager.hasRelationship(relationship.relatedName, relationship.name)) {
      return new InputObjectTypeDefinition()
      .name(this.namer.buildCreateRelationalName(relationship))
      .node()
    }
  }

  public buildUpdateRelationalInput(relationship: Relationship): InputObjectTypeDefinitionNode | undefined {
    if (this.relationshipManager.hasRelationship(relationship.relatedName, relationship.name)) {
      return new InputObjectTypeDefinition()
      .name(this.namer.buildUpdateRelationalName(relationship))
      .node()
    }
  }
}
