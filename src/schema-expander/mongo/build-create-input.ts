import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isInputType,
  GraphQLSchema,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  ListType,
  NamedType,
  NonNullType,
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'
import {
  unwrap,
  hasDirective,
} from '../../utilities'

export const createInputName = (name: string) => `${name}CreateInput`

export function buildCreateInput(
  {
    name: {
      value: name
    },
    fields
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode {
  return new InputObjectTypeDefinition()
  .name(createInputName(name))
  .description(`\`${name}\` create definition`)
  .fields(_ =>
    (fields || []).reduce((
      fields,
      {
        name: {
          value: name,
        },
        type,
        directives,
      }: FieldDefinitionNode
    ) => {
      // These are handled internally
      if (['id', 'createdAt', 'updatedAt'].includes(name)) {
        return fields
      }

      const { required, list, namedType } = unwrap(type)
      const gqlType = typeFromAST(schema, namedType)

      if (gqlType && isInputType(gqlType)) {
        const typeNode = list ?
        new ListType()
        .type(
          new NonNullType()
          .type(namedType)
          .node()
        )
        .node()
        :
        namedType

        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(required ?
            new NonNullType()
            .type(typeNode)
            .node()
            :
            typeNode
          )
          .node()
        )
      }

      if (hasDirective(directives, 'embedded')) {
        const namedTypeNode = new NamedType()
        .name(createInputName(namedType.name.value))
        .node()
        const typeNode = list ?
        new ListType()
        .type(
          new NonNullType()
          .type(namedTypeNode)
          .node()
        )
        .node()
        :
        namedTypeNode

        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(required ?
            new NonNullType()
            .type(typeNode)
            .node()
            :
            typeNode
          )
          .node()
        )
      }

      return fields
    }, [] as InputValueDefinitionNode[])
  )
  .node()
}
