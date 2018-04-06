import {
  NameNode,
  DirectiveNode,
  StringValueNode,
} from 'graphql/language'

import {
  Node,
  Mutator,
  Builder,
} from './abstract-builder'
import { Name } from './name'
import { StringValue } from './string-value'

export interface DefinitionNode extends Node {
  name: NameNode
  description?: StringValueNode
  directives?: DirectiveNode[]
}

export abstract class Definition<T extends DefinitionNode> extends Builder<T> {
  public name(name: string): this {
    this._node.name = new Name()
    .value(name)
    .node()

    return this
  }

  public description(description: string): this {
    this._node.description = new StringValue()
    .value(description)
    .block(true)
    .node()

    return this
  }

  public directives(mutator: Mutator<DirectiveNode>): this {
    this._node.directives = mutator(this._node.directives || [])

    return this
  }
}
