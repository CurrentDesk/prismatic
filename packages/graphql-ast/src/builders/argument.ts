import {
  ValueNode,
  ArgumentNode,
} from 'graphql/language'

import { Builder } from './abstract-builder'
import { Name } from './name'

export class Argument extends Builder<ArgumentNode> {
  public name(name: string): this {
    this._node.name = new Name()
    .value(name)
    .node()

    return this
  }

  public value(value: ValueNode): this {
    this._node.value = value

    return this
  }
}
