import {
  ArgumentNode,
  DirectiveNode,
} from 'graphql/language'

import { Builder } from './abstract-builder'
import { Name } from './name'

export class Directive extends Builder<DirectiveNode> {
  public name(name: string): this {
    this._node.name = new Name()
    .value(name)
    .node()

    return this
  }

  public arguments(args: ArgumentNode[]): this {
    this._node.arguments = args

    return this
  }
}
