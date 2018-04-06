import {
  TypeNode,
  ListTypeNode,
} from 'graphql/language'

import { Builder } from './abstract-builder'

export class ListType extends Builder<ListTypeNode> {
  public type(type: TypeNode): this {
    this._node.type = type

    return this
  }
}
