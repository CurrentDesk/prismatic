import {
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
} from 'graphql/language'

import { Builder } from './abstract-builder'

export class NonNullType extends Builder<NonNullTypeNode> {
  public type(type: NamedTypeNode | ListTypeNode): this {
    this._node.type = type

    return this
  }
}
