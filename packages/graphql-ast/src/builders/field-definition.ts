import {
  TypeNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'

import { Mutator } from './abstract-builder'
import { Definition } from './abstract-definition'

export class FieldDefinition extends Definition<FieldDefinitionNode> {
  public type(type: TypeNode): this {
    this._node.type = type

    return this
  }

  public arguments(mutator: Mutator<InputValueDefinitionNode>): this {
    this._node.arguments = mutator((this._node.arguments || []) as InputValueDefinitionNode[])

    return this
  }
}
