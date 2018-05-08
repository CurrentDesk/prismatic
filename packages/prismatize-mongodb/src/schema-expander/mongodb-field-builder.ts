import {
  FieldDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import {
  isEnumType,
  isScalarType,
  isObjectType,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  camelize,
  pluralize,
  singularize,
} from 'inflected'

import { FieldBuilder } from '@currentdesk/prismatize'
import {
  unwrap,
  hasDirective,
  ListType,
  NamedType,
  NonNullType,
  FieldDefinition,
  InputValueDefinition,
} from '@currentdesk/graphql-ast'

export class MongoDBFieldBuilder extends FieldBuilder {
  public buildReadManyField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      const fieldName = camelize(name, false)

      return new FieldDefinition()
      .name(pluralize(fieldName))
      .arguments(() => this.argumentsBuilder.buildWhereArguments(name))
      .type(NonNullType.node(ListType.node(NamedType.node(name))))
      .node()
    }
  }

  public buildReadItemField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      const fieldName = camelize(name, false)

      return new FieldDefinition()
      .name(singularize(fieldName))
      .arguments(() => this.argumentsBuilder.buildWhereUniqueArguments(name))
      .type(NamedType.node(name))
      .node()
    }
  }

  public buildCreateItemField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      return new FieldDefinition()
      .name(`create${name}`)
      .arguments(() => this.argumentsBuilder.buildCreateArguments(name))
      .node()
    }
  }

  public buildUpdateItemField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      return new FieldDefinition()
      .name(`update${name}`)
      .arguments(() => this.argumentsBuilder.buildUpdateArguments(name))
      .node()
    }
  }

  public buildDeleteItemField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      return new FieldDefinition()
      .name(`delete${name}`)
      .arguments(() => this.argumentsBuilder.buildDeleteArguments(name))
      .node()
    }
  }

  public buildCreateManyField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      return new FieldDefinition()
      .name(`createMany${name}`)
      .arguments(() => this.argumentsBuilder.buildCreateManyArguments(name))
      .node()
    }
  }

  public buildUpdateManyField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      return new FieldDefinition()
      .name(`updateMany${name}`)
      .arguments(() => this.argumentsBuilder.buildUpdateManyArguments(name))
      .node()
    }
  }

  public buildDeleteManyField(
    {
      name: {
        value: name,
      },
      directives,
    }: ObjectTypeDefinitionNode
  ): FieldDefinitionNode | undefined {
    if (!hasDirective(directives, 'embedded')) {
      return new FieldDefinition()
      .name(`deleteMany${name}`)
      .arguments(() => this.argumentsBuilder.buildDeleteManyArguments(name))
      .node()
    }
  }

  public buildWhereInputLogicalFields(name: string): InputValueDefinitionNode[] {
    const logicalType = NamedType.node(this.namer.buildWhereInputName(name))
    const logicalListType = ListType.node(NonNullType.node(logicalType))

    return [
      new InputValueDefinition()
      .name('AND')
      .type(logicalListType)
      .node(),
      new InputValueDefinition()
      .name('OR')
      .type(logicalListType)
      .node(),
      new InputValueDefinition()
      .name('NOR')
      .type(logicalListType)
      .node(),
      new InputValueDefinition()
      .name('NOT')
      .type(logicalType)
      .node(),
    ]
  }

  public buildWhereInputFields(fields: ReadonlyArray<FieldDefinitionNode>): InputValueDefinitionNode[] {
    return fields.reduce((
      fields,
      {
        name: {
          value: name,
        },
        type,
      }: FieldDefinitionNode
    ) => {
      const {
        list,
        namedType,
      } = unwrap(type)
      const gqlType = typeFromAST(this.schema, namedType)
      const opName = (operator: string) => `${name}_${operator}`

      if (gqlType && isScalarType(gqlType)) {
        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(namedType)
          .node(),
          [
            'ne',
            'gt',
            'gte',
            'lt',
            'lte',
          ].map(
            operator =>
            new InputValueDefinition()
            .name(opName(operator))
            .type(namedType)
            .node()
          ),
          [
            'in',
            'nin',
          ].map(
            operator =>
            new InputValueDefinition()
            .name(opName(operator))
            .type(ListType.node(NonNullType.node(namedType)))
            .node()
          )
        )
      }

      if (gqlType && isEnumType(gqlType)) {
        return fields.concat(
          new InputValueDefinition()
          .name(name)
          .type(namedType)
          .node(),
          [
            'ne',
          ].map(
            operator =>
            new InputValueDefinition()
            .name(opName(operator))
            .type(namedType)
            .node()
          ),
          [
            'in',
            'nin',
          ].map(
            operator =>
            new InputValueDefinition()
            .name(opName(operator))
            .type(ListType.node(NonNullType.node(namedType)))
            .node()
          )
        )
      }

      if (gqlType && isObjectType(gqlType)) {
        const objectTypeName = this.namer.buildWhereInputName(namedType.name.value)

        if (list) {
          return fields.concat(
            [
              'all',
              'elemMatch',
            ].map(
              operator =>
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
  }

  public buildWhereUniqueInputFields(fields: ReadonlyArray<FieldDefinitionNode>): InputValueDefinitionNode[] {
    return fields
    .filter(({ directives }) => hasDirective(directives, 'unique'))
    .map(
      ({
        name: {
          value: name,
        },
        type,
      }) =>
      new InputValueDefinition()
      .name(name)
      .type(type.kind === 'NonNullType' ? type.type : type)
      .node()
    )
  }
}
