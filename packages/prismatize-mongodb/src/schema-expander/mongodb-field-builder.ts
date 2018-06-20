import {
  FieldDefinitionNode,
  EnumValueDefinitionNode,
  ObjectTypeDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import {
  isEnumType,
  isInputType,
  isScalarType,
  isObjectType,
} from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  camelize,
  pluralize,
  singularize,
} from 'inflected'

import {
  Maybe,
  Relationship,
  FieldBuilder,
} from '@currentdesk/prismatize'
import {
  unwrap,
  getNamedType,
  hasDirective,
  ListType,
  NamedType,
  NonNullType,
  FieldDefinition,
  EnumValueDefinition,
  InputValueDefinition,
} from '@currentdesk/graphql-ast'

const SystemFields = [
  'id',
  'createdAt',
  'updatedAt',
]

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
      .type(NonNullType.node(NamedType.node(name)))
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
      .type(NamedType.node(name))
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
      .type(NamedType.node(name))
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
      .type(NamedType.node('Int'))
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
      .type(NamedType.node('Int'))
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
      .type(NamedType.node('Int'))
      .node()
    }
  }

  public buildOrderByInputFields(fields: ReadonlyArray<FieldDefinitionNode>): EnumValueDefinitionNode[] {
    return fields
    .filter(field => {
      const gqlType = typeFromAST(this.schema, getNamedType(field.type))

      return gqlType !== undefined && isInputType(gqlType)
    })
    .reduce((
      values,
      {
        name: {
          value: name,
        },
      }
    ) => {
      return values.concat(
        new EnumValueDefinition().name(`${name}_ASC`).node(),
        new EnumValueDefinition().name(`${name}_DESC`).node(),
      )
    }, [] as EnumValueDefinitionNode[])
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
      }
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
    .map((
      {
        name: {
          value: name,
        },
        type,
      }
    ) =>
      new InputValueDefinition()
      .name(name)
      .type(type.kind === 'NonNullType' ? type.type : type)
      .node()
    )
  }

  public buildCreateInputFields(
    fields: ReadonlyArray<FieldDefinitionNode>,
    {
      name: {
        value: modelName,
      },
      directives: modelDirectives,
    }: ObjectTypeDefinitionNode,
  ): InputValueDefinitionNode[] {
    return fields.reduce((
      fields: InputValueDefinitionNode[],
      {
        name: {
          value: name,
        },
        type,
        directives,
      },
    ) => {
      const isModelEmbedded = hasDirective(modelDirectives, 'embedded')

      if (!isModelEmbedded && SystemFields.includes(name)) return fields

      const {
        list,
        required,
        namedType,
      } = unwrap(type)
      const {
        name: {
          value: namedTypeName
        }
      } = namedType
      const gqlType = typeFromAST(this.schema, namedType)
      const isEmbedded = hasDirective(directives, 'embedded')
      const hasDefaultValue = hasDirective(directives, 'default')

      if (gqlType) {
        if (isInputType(gqlType)) {
          const typeNode = list ? ListType.node(NonNullType.node(namedType)) : namedType

          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(required && !hasDefaultValue ? NonNullType.node(typeNode) : typeNode)
            .node()
          )
        }

        if (isObjectType(gqlType)) {
          if (isEmbedded) {
            const namedTypeNode = NamedType.node(this.namer.buildCreateInputName(namedTypeName))
            const typeNode = list ? ListType.node(namedTypeNode) : namedTypeNode

            return fields.concat(
              new InputValueDefinition()
              .name(name)
              .type(required && !hasDefaultValue ? NonNullType.node(typeNode) : typeNode)
              .node()
            )
          }

          const relationship = this.relationshipManager.findRelationship(modelName, namedTypeName)
          const namedTypeNode = NamedType.node(
            relationship
            ?
            this.namer.buildCreateRelationalName(relationship)
            :
            this.namer.buildCreateInputName(namedTypeName)
          )

          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(required ? NonNullType.node(namedTypeNode) : namedTypeNode)
            .node()
          )
        }
      } else {
        throw new Error('AST type not found in GraphQLSchema')
      }

      return fields
    }, [])
  }

  public buildUpdateInputFields(
    fields: ReadonlyArray<FieldDefinitionNode>,
    {
      name: {
        value: modelName,
      },
      directives: modelDirectives,
    }: ObjectTypeDefinitionNode,
  ): InputValueDefinitionNode[] {
    return fields.reduce((
      fields: InputValueDefinitionNode[],
      {
        name: {
          value: name,
        },
        type,
        directives,
      },
    ) => {
      const isModelEmbedded = hasDirective(modelDirectives, 'embedded')

      if (!isModelEmbedded && SystemFields.includes(name)) return fields

      const {
        list,
        namedType,
      } = unwrap(type)
      const {
        name: {
          value: namedTypeName
        }
      } = namedType
      const gqlType = typeFromAST(this.schema, namedType)
      const isEmbedded = hasDirective(directives, 'embedded')

      if (gqlType) {
        if (isInputType(gqlType)) {
          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(namedType)
            .node()
          )
        }

        if (isObjectType(gqlType)) {
          if (isEmbedded) {
            const namedTypeNode = NamedType.node(this.namer.buildUpdateInputName(namedTypeName))
            const typeNode = list ? ListType.node(namedTypeNode) : namedTypeNode

            return fields.concat(
              new InputValueDefinition()
              .name(name)
              .type(typeNode)
              .node()
            )
          }

          const relationship = this.relationshipManager.findRelationship(namedTypeName, modelName)
          const namedTypeNode = NamedType.node(
            relationship
            ?
            this.namer.buildUpdateRelationalName(relationship)
            :
            this.namer.buildUpdateInputName(namedTypeName)
          )

          return fields.concat(
            new InputValueDefinition()
            .name(name)
            .type(namedTypeNode)
            .node()
          )
        }
      }

      return fields
    }, [])
  }

  public buildCreateRelationalInputField(
    {
      modelName,
      relatedModelName,
    }: Relationship
  ): Maybe<InputValueDefinitionNode> {
    const toMany = this.relationshipManager.isToManyRelationship(relatedModelName, modelName)
    const namedTypeNode = NamedType.node(this.namer.buildCreateInputName(modelName, relatedModelName))
    const typeNode = toMany ? ListType.node(NonNullType.node(namedTypeNode)) : namedTypeNode

    return new InputValueDefinition()
    .name('create')
    .type(typeNode)
    .node()
  }

  public buildConnectRelationalInputField(
    {
      modelName,
      relatedModelName,
    }: Relationship
  ): Maybe<InputValueDefinitionNode> {
    const toMany = this.relationshipManager.isToManyRelationship(relatedModelName, modelName)
    const namedTypeNode = NamedType.node(this.namer.buildWhereUniqueInputName(modelName))
    const typeNode = toMany ? ListType.node(NonNullType.node(namedTypeNode)) : namedTypeNode

    return new InputValueDefinition()
    .name('connect')
    .type(typeNode)
    .node()
  }

  public buildDisconnectRelationalInputField(
    {
      modelName,
      relatedModelName,
    }: Relationship
  ): Maybe<InputValueDefinitionNode> {
    const toMany = this.relationshipManager.isToManyRelationship(relatedModelName, modelName)
    const namedTypeNode = NamedType.node(
      toMany
      ?
      this.namer.buildWhereUniqueInputName(modelName)
      :
      'Boolean'
    )
    const typeNode = toMany ? ListType.node(NonNullType.node(namedTypeNode)) : namedTypeNode

    return new InputValueDefinition()
    .name('disconnect')
    .type(typeNode)
    .node()
  }

  public buildDeleteRelationalInputField(
    {
      modelName,
      relatedModelName,
    }: Relationship
  ): Maybe<InputValueDefinitionNode> {
    const toMany = this.relationshipManager.isToManyRelationship(relatedModelName, modelName)
    const namedTypeNode = NamedType.node(
      toMany
      ?
      this.namer.buildWhereUniqueInputName(modelName)
      :
      'Boolean'
    )
    const typeNode = toMany ? ListType.node(NonNullType.node(namedTypeNode)) : namedTypeNode

    return new InputValueDefinition()
    .name('delete')
    .type(typeNode)
    .node()
  }

  // public buildUpdateRelationalInputField(
  //   {
  //     modelName,
  //     relatedModelName,
  //   }: Relationship
  // ): Maybe<InputValueDefinitionNode> {
  //
  // }

  public buildCreatePostRelationalInputFields(
    {
      modelName,
      fieldName,
    }: Relationship
  ): InputValueDefinitionNode[] {
    const gqlType = this.schema.getType(modelName)

    if (gqlType) {
      const model = gqlType.astNode as ObjectTypeDefinitionNode

      if (model.fields) {
        return this.buildCreateInputFields(
          model.fields.filter(field => field.name.value !== fieldName),
          model,
        )
      } else {
        throw new Error('Model has no fields')
      }
    } else {
      throw new Error('Model not found in GraphQLSchema')
    }
  }
}
