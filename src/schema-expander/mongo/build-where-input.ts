import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  InputObjectTypeDefinitionNode,
} from 'graphql/language'
import { GraphQLSchema } from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  ListType,
  NamedType,
  NonNullType,
  InputValueDefinition,
  InputObjectTypeDefinition,
} from '../../builders'
import { unwrap } from '../../utilities'
import {
  isEnumType,
  isScalarType,
  isObjectType,
} from '../../type'

export const whereInputName = (name: string) => `${name}WhereInput`

// TODO: Move these to a config file
const scalarOperators = [
  'ne',
  'gt',
  'gte',
  'lt',
  'lte',
]

const enumOperators = [
  'ne',
]

const listInputOperators = [
  'in',
  'nin',
]

const listOperators = [
  'all',
  'elemMatch',
]

export function buildWhereInput(
  {
    name: {
      value: name
    },
    fields
  }: ObjectTypeDefinitionNode,
  schema: GraphQLSchema
): InputObjectTypeDefinitionNode {
  const whereInputLogicalType = new NamedType().name(whereInputName(name)).node()
  const whereInputLogicalListType = new ListType()
  .type(
    new NonNullType()
    .type(whereInputLogicalType)
    .node()
  )
  .node()

  return new InputObjectTypeDefinition()
  .name(whereInputName(name))
  .description(`\`${name}\` filter definition`)
  .fields(_ =>
    [
      new InputValueDefinition()
      .name('AND')
      .type(whereInputLogicalListType)
      .node(),
      new InputValueDefinition()
      .name('OR')
      .type(whereInputLogicalListType)
      .node(),
      new InputValueDefinition()
      .name('NOR')
      .type(whereInputLogicalListType)
      .node(),
      new InputValueDefinition()
      .name('NOT')
      .type(whereInputLogicalType)
      .node()
    ].concat(
      (fields || []).reduce((fields, field: FieldDefinitionNode) => {
        const {
          name: { value: name },
          type,
        } = field
        const { namedType, list } = unwrap(type)
        const gqlType = typeFromAST(schema, namedType)
        const opName = (operator: string) => `${name}_${operator}`

        if (isScalarType(gqlType)) {
          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(namedType)
            .node(),
            scalarOperators.map(operator =>
              new InputValueDefinition()
              .name(opName(operator))
              .type(namedType)
              .node()
            ),
            listInputOperators.map(operator =>
              new InputValueDefinition()
              .name(opName(operator))
              .type(ListType.node(NonNullType.node(namedType)))
              .node()
            )
          )
        }

        if (isEnumType(gqlType)) {
          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(namedType)
            .node(),
            enumOperators.map(operator =>
              new InputValueDefinition()
              .name(opName(operator))
              .type(namedType)
              .node()
            ),
            listInputOperators.map(operator =>
              new InputValueDefinition()
              .name(opName(operator))
              .type(ListType.node(NonNullType.node(namedType)))
              .node()
            )
          )
        }

        if (isObjectType(gqlType)) {
          const objectTypeName = whereInputName(namedType.name.value)

          if (list) {
            return fields.concat(
              listOperators.map(operator =>
                new InputValueDefinition()
                .name(opName(operator))
                .type(NamedType.node(objectTypeName))
                .node()
              )
            )
          }

          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(NamedType.node(objectTypeName))
            .node()
          )
        }

        return fields
      }, [] as InputValueDefinitionNode[])
    )
  )
  .node()
}
