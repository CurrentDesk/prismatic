import {
  ObjectTypeDefinitionNode,
  FieldDefinitionNode,
  NamedTypeNode,
} from 'graphql/language'

import { Mutator } from './abstract-builder'
import { Definition } from './abstract-definition'

export class ObjectTypeDefinition extends Definition<ObjectTypeDefinitionNode> {
  public fields(mutator: Mutator<FieldDefinitionNode>): this {
    this._node.fields = mutator((this._node.fields || []) as FieldDefinitionNode[])

    return this
  }

  public interfaces(mutator: Mutator<NamedTypeNode>): this {
    this._node.interfaces = mutator((this._node.interfaces || []) as NamedTypeNode[])

    return this
  }
}
