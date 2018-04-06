import {
  DirectiveDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'

import { Mutator } from './abstract-builder'
import { Definition } from './abstract-definition'

import { Name } from './name'

export type Locations =
  | 'QUERY'
  | 'MUTATION'
  | 'SUBSCRIPTION'
  | 'FIELD'
  | 'FRAGMENT_DEFINITION'
  | 'FRAGMENT_SPREAD'
  | 'INLINE_FRAGMENT'
  | 'SCHEMA'
  | 'SCALAR'
  | 'OBJECT'
  | 'FIELD_DEFINITION'
  | 'ARGUMENT_DEFINITION'
  | 'INTERFACE'
  | 'UNION'
  | 'ENUM'
  | 'ENUM_VALUE'
  | 'INPUT_OBJECT'
  | 'INPUT_FIELD_DEFINITION'

export class DirectiveDefinition extends Definition<DirectiveDefinitionNode> {
  public locations(locations: Locations[]): this {
    this._node.locations = locations.map(name => new Name().value(name).node())

    return this
  }

  public arguments(mutator: Mutator<InputValueDefinitionNode>): this {
    this._node.arguments = mutator(this._node.arguments || [])

    return this
  }

  public directives(): never {
    throw new Error("Directives can't have directives")
  }
}
