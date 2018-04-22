import { NamedTypeNode } from 'graphql/language'

import { Builder } from './abstract-builder'
import { Name } from './name'

export class NamedType extends Builder<NamedTypeNode> {
  public static node(name: string): NamedTypeNode {
    return new this().name(name).node()
  }

  public name(name: string): this {
    this._node.name = new Name()
    .value(name)
    .node()

    return this
  }
}
