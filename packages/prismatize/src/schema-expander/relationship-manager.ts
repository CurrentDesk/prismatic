import {
  TypeNode,
  ObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isObjectType,
  GraphQLSchema,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  getNamedType,
  isWrappingType,
} from '@currentdesk/graphql-ast'

export interface Relationship {
  name: string
  toMany: boolean
  relatedName: string
}

function getRelationship(type: TypeNode, relationship: Partial<Relationship>): Relationship {
  if (type.kind === 'ListType') {
    relationship.toMany = true
  }

  if (isWrappingType(type)) {
    return getRelationship(type.type, relationship)
  }

  relationship.relatedName = type.name.value

  return relationship as Relationship
}

export class RelationshipManager {
  private relationships: Relationship[]

  public constructor(private schema: GraphQLSchema) {
    this.relationships = []
  }

  public get allRelationships(): Relationship[] {
    return this.relationships
  }

  public isRelation(type: TypeNode): boolean {
    const gqlType = typeFromAST(this.schema, getNamedType(type))

    return gqlType !== undefined && isObjectType(gqlType)
  }

  public hasRelationship(name: string, relatedName: string): boolean {
    return this.relationships.some(other => other.name === name && other.relatedName === relatedName)
  }

  public isToManyRelationship(name: string, relatedName: string): boolean {
    return this.relationships.some(other => other.name === name && other.relatedName === relatedName && other.toMany)
  }

  public recordRelationships({ name: { value: name }, fields }: ObjectTypeDefinitionNode) {
    (fields || []).forEach(({ type }) => {
      if (this.isRelation(type)) {
        this.relationships.push(getRelationship(type, { name }))
      }
    })
  }
}
