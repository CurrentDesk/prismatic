import {
  EnumTypeDefinitionNode,
  ObjectTypeDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isNil,
  reject,
} from 'ramda'

import {
  Maybe,
  Relationship,
  InputBuilder,
} from '@currentdesk/prismatize'
import {
  hasDirective,
  EnumTypeDefinition,
  InputObjectTypeDefinition,
} from '@currentdesk/graphql-ast'

type RejectNil = <T>(items: Maybe<T>[]) => T[]
const rejectNil: RejectNil = reject(isNil)

export class MongoDBInputBuilder extends InputBuilder {
  public buildOrderByInput(model: ObjectTypeDefinitionNode): Maybe<EnumTypeDefinitionNode> {
    const {
      name: {
        value: modelName,
      },
      fields,
      directives,
    } = model

    if (fields && !hasDirective(directives, 'embedded')) {
      return new EnumTypeDefinition()
      .name(this.namer.buildOrderByInputName(modelName))
      .values(() => this.fieldBuilder.buildOrderByInputFields(fields))
      .node()
    }
  }

  public buildWhereInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode> {
    const {
      name: {
        value: name,
      },
      fields,
    } = model

    if (fields) {
      return new InputObjectTypeDefinition()
      .name(this.namer.buildWhereInputName(name))
      .fields(
        () => [
          ...this.fieldBuilder.buildWhereInputLogicalFields(name),
          ...this.fieldBuilder.buildWhereInputFields(fields, model)
        ]
      )
      .node()
    }
  }

  public buildWhereUniqueInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode> {
    const {
      name: {
        value: name,
      },
      fields,
    } = model

    if (fields) {
      const uniqueFields = this.fieldBuilder.buildWhereUniqueInputFields(fields, model)

      if (uniqueFields.length > 0) {
        return new InputObjectTypeDefinition()
        .name(this.namer.buildWhereUniqueInputName(name))
        .fields(() => uniqueFields)
        .node()
      }
    }
  }

  public buildCreateInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode> {
    const {
      name: {
        value: name,
      },
      fields,
    } = model

    if (fields) {
      return new InputObjectTypeDefinition()
      .name(this.namer.buildCreateInputName(name))
      .fields(() => this.fieldBuilder.buildCreateInputFields(fields, model))
      .node()
    }
  }

  public buildUpdateInput(model: ObjectTypeDefinitionNode): Maybe<InputObjectTypeDefinitionNode> {
    const {
      name: {
        value: name,
      },
      fields,
    } = model

    if (fields) {
      return new InputObjectTypeDefinition()
      .name(this.namer.buildUpdateInputName(name))
      .fields(() => this.fieldBuilder.buildUpdateInputFields(fields, model))
      .node()
    }
  }

  public buildCreateRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode> {
    return new InputObjectTypeDefinition()
    .name(this.namer.buildCreateRelationalName(relationship))
    .fields(() => rejectNil([
      this.fieldBuilder.buildCreateRelationalInputField(relationship),
      this.fieldBuilder.buildConnectRelationalInputField(relationship),
    ]))
    .node()
  }

  public buildUpdateRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode> {
    return new InputObjectTypeDefinition()
    .name(this.namer.buildUpdateRelationalName(relationship))
    .fields(() => rejectNil([
      this.fieldBuilder.buildCreateRelationalInputField(relationship),
      this.fieldBuilder.buildConnectRelationalInputField(relationship),
      this.fieldBuilder.buildDisconnectRelationalInputField(relationship),
      this.fieldBuilder.buildDeleteRelationalInputField(relationship),
    ]))
    .node()
  }

  public buildCreatePostRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode> {
    const {
      modelName,
      relatedModelName,
    } = relationship

    return new InputObjectTypeDefinition()
    .name(this.namer.buildCreateInputName(modelName, relatedModelName))
    .fields(() => this.fieldBuilder.buildCreatePostRelationalInputFields(relationship))
    .node()
  }

  public buildUpdatePostRelationalInput(relationship: Relationship): Maybe<InputObjectTypeDefinitionNode> {
    const {
      modelName,
      relatedModelName,
    } = relationship

    return new InputObjectTypeDefinition()
    .name(this.namer.buildUpdateInputName(modelName, relatedModelName))
    .node()
  }
}
