import {
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'

import { Mutator } from './abstract-builder'
import { Definition } from './abstract-definition'

export class InputObjectTypeDefinition extends Definition<InputObjectTypeDefinitionNode> {
  public fields(mutator: Mutator<InputValueDefinitionNode>): this {
    this._node.fields = mutator(this._node.fields || [])

    return this
  }
}
