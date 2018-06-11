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

import { Maybe } from './maybe'

export interface Relationship {
  modelName: string
  fieldName: string
  relatedModelName: string
  toMany: boolean
}

function getRelationship(type: TypeNode, relationship: Partial<Relationship>): Relationship {
  if (type.kind === 'ListType') {
    relationship.toMany = true
  }

  if (isWrappingType(type)) {
    return getRelationship(type.type, relationship)
  }

  relationship.relatedModelName = type.name.value

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

  public findRelationship(modelName: string, relatedModelName: string): Maybe<Relationship> {
    return this.relationships.find(other => other.modelName === modelName && other.relatedModelName === relatedModelName)
  }

  public isRelation(type: TypeNode): boolean {
    const gqlType = typeFromAST(this.schema, getNamedType(type))

    return gqlType !== undefined && isObjectType(gqlType)
  }

  public hasReverseRelationship({ modelName, relatedModelName }: Relationship): boolean {
    return this.hasRelationship(relatedModelName, modelName)
  }

  public hasRelationship(modelName: string, relatedModelName: string): boolean {
    return this.relationships.some(other => other.modelName === modelName && other.relatedModelName === relatedModelName)
  }

  public isToManyRelationship(modelName: string, relatedModelName: string): boolean {
    return this.relationships.some(other => other.modelName === modelName && other.relatedModelName === relatedModelName && other.toMany)
  }

  public recordRelationships(
    {
      name: {
        value: modelName,
      },
      fields,
    }: ObjectTypeDefinitionNode,
  ) {
    (fields || []).forEach((
      {
        name: {
          value: fieldName,
        },
        type,
      },
    ) => {
      if (this.isRelation(type)) {
        this.relationships.push(getRelationship(type, { fieldName, modelName }))
      }
    })
  }
}
