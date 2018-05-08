import {
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
} from 'graphql/language'

import { Builder } from './abstract-builder'

export class NonNullType extends Builder<NonNullTypeNode> {
  public static node(type: NamedTypeNode | ListTypeNode): NonNullTypeNode {
    return new this().type(type).node()
  }

  public type(type: NamedTypeNode | ListTypeNode): this {
    this._node.type = type

    return this
  }
}
