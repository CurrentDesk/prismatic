import {
  TypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'

import { Definition } from './abstract-definition'

export class InputValueDefinition extends Definition<InputValueDefinitionNode> {
  public static fromFieldDefinition(field: FieldDefinitionNode): InputValueDefinition {
    const definition = new this()

    definition._node.name = field.name
    definition._node.type = field.type.kind === 'NonNullType' ? field.type.type : field.type

    return definition
  }

  public type(type: TypeNode): this {
    this._node.type = type

    return this
  }
}
