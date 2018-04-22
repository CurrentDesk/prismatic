import {
  TypeNode,
  ListTypeNode,
} from 'graphql/language'

import { Builder } from './abstract-builder'

export class ListType extends Builder<ListTypeNode> {
  public static node(type: TypeNode): ListTypeNode {
    return new this().type(type).node()
  }

  public type(type: TypeNode): this {
    this._node.type = type

    return this
  }
}
