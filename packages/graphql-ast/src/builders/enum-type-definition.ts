import {
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
} from 'graphql/language'

import { Mutator } from './abstract-builder'

import { Definition } from './abstract-definition'

export class EnumTypeDefinition extends Definition<EnumTypeDefinitionNode> {
  public values(mutator: Mutator<EnumValueDefinitionNode>): this {
    this._node.values = mutator((this._node.values || []) as EnumValueDefinitionNode[])

    return this
  }
}
