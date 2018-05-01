import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import {
  isInputType,
  isObjectType,
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

import { createManyInputName } from './build-create-many-input'

export const createInputName = (name: string) => `${name}CreateInput`

export function buildCreateInput(
  {
    name: {
      value: name,
    },
    fields,
    directives: objectTypeDirectives,
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
      if (!hasDirective(objectTypeDirectives, 'embedded') && ['id', 'createdAt', 'updatedAt'].includes(name)) {
        return fields
      }

      const { required, list, namedType } = unwrap(type)
      const gqlType = typeFromAST(schema, namedType)

      // Non-objects
      if (gqlType && isInputType(gqlType)) {
        const typeNode = list ?
        ListType.node(NonNullType.node(namedType))
        :
        namedType

        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(required && !hasDirective(directives, 'default') ? NonNullType.node(typeNode) : typeNode)
          .node()
        )
      }

      if (gqlType && isObjectType(gqlType)) {
        if (hasDirective(directives, 'embedded')) {
          const namedTypeNode = NamedType.node(createInputName(namedType.name.value))
          const typeNode = list ? ListType.node(NonNullType.node(namedTypeNode)) : namedTypeNode

          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(required ? NonNullType.node(typeNode) : typeNode)
            .node()
          )
        } else {
          const namedTypeNode = NamedType.node((list ? createManyInputName : createInputName)(namedType.name.value))

          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(namedTypeNode)
            .node()
          )
        }
      }

      return fields
    }, [] as InputValueDefinitionNode[])
  )
  .node()
}
