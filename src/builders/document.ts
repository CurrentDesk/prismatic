import {
  DocumentNode,
  DefinitionNode,
} from 'graphql/language'

import {
  Mutator,
  Builder,
} from './abstract-builder'

export class Document extends Builder<DocumentNode> {
  public definitions(mutator: Mutator<DefinitionNode>): this {
    this._node.definitions = mutator(this._node.definitions)

    return this
  }
}
