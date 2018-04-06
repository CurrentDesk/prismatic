import {
  EnumTypeDefinitionNode,
  EnumValueDefinitionNode,
} from 'graphql/language'

import { Definition } from './abstract-definition'

export class EnumTypeDefinition extends Definition<EnumTypeDefinitionNode> {
  public values(values: EnumValueDefinitionNode[]): this {
    this._node.values = values

    return this
  }
}
