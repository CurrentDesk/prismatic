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

export interface Relation {
  name: string
  toMany: boolean
  relatedName: string
}

function getRelation(type: TypeNode, relation: Partial<Relation>): Relation {
  if (type.kind === 'ListType') {
    relation.toMany = true
  }

  if (isWrappingType(type)) {
    return getRelation(type.type, relation)
  }

  relation.relatedName = type.name.value

  return relation as Relation
}

export class RelationshipManager {
  private relations: Relation[]

  public constructor(private schema: GraphQLSchema) {}

  public recordRelations(
    {
      name: {
        value: name,
      },
      fields,
    }: ObjectTypeDefinitionNode,
  ) {
    (fields || []).forEach(({
      type,
    }) => {
      const gqlType = typeFromAST(this.schema, getNamedType(type))

      if (gqlType && isObjectType(gqlType)) {
        const relation = getRelation(type, { name })

        this.relations.push(relation)
      }
    })
  }
}
