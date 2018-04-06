import { NameNode } from 'graphql/language'

import { Builder } from './abstract-builder'

export class Name extends Builder<NameNode> {
  public value(name: string): this {
    this._node.value = name

    return this
  }
}
