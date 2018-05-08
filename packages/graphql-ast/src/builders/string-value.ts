import { StringValueNode } from 'graphql/language'

import { Builder } from './abstract-builder'

export class StringValue extends Builder<StringValueNode> {
  public value(value: string): this {
    this._node.value = value

    return this
  }

  public block(block: boolean): this {
    this._node.block = block

    return this
  }
}
