import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql/language'
import { isObjectType } from 'graphql/type'
import { typeFromAST } from 'graphql/utilities'

import {
  unwrap,
  hasDirective,

  ListType,
  NamedType,
  NonNullType,
  FieldDefinition,
  InputValueDefinition,
} from '@currentdesk/graphql-ast'
import { ArgumentsBuilder } from '@currentdesk/prismatize'

export class MongoDBArgumentsBuilder extends ArgumentsBuilder {
  public buildWhereArgumentsForField(node: FieldDefinitionNode) {
    const {
      list,
      namedType,
    } = unwrap(node.type)
    const {
      name: {
        value: name,
      },
    } = namedType
    const gqlType = typeFromAST(this.schema, namedType)

    if (list && gqlType && isObjectType(gqlType) && !hasDirective(node.directives, 'embedded')) {
      new FieldDefinition(node).arguments(() => this.buildWhereArguments(name))
    }
  }

  public buildWhereArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('where')
      .type(NamedType.node(this.namer.buildWhereInputName(name)))
      .node(),
      new InputValueDefinition()
      .name('orderBy')
      .type(NamedType.node(this.namer.buildOrderByInputName(name)))
      .node(),
      new InputValueDefinition()
      .name('skip')
      .type(NamedType.node('Int'))
      .node(),
      new InputValueDefinition()
      .name('first')
      .type(NamedType.node('Int'))
      .node(),
      new InputValueDefinition()
      .name('last')
      .type(NamedType.node('Int'))
      .node(),
    ]
  }

  public buildWhereUniqueArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('where')
      .type(NonNullType.node(NamedType.node(this.namer.buildWhereUniqueInputName(name))))
      .node(),
    ]
  }

  public buildCreateArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('data')
      .type(NonNullType.node(NamedType.node(this.namer.buildCreateInputName(name))))
      .node(),
    ]
  }

  public buildUpdateArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('data')
      .type(NonNullType.node(NamedType.node(this.namer.buildUpdateInputName(name))))
      .node(),
      new InputValueDefinition()
      .name('where')
      .type(NonNullType.node(NamedType.node(this.namer.buildWhereUniqueInputName(name))))
      .node(),
    ]
  }

  public buildDeleteArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('where')
      .type(NonNullType.node(NamedType.node(this.namer.buildWhereUniqueInputName(name))))
      .node(),
    ]
  }

  public buildCreateManyArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('data')
      .type(NonNullType.node(ListType.node(NonNullType.node(NamedType.node(this.namer.buildCreateInputName(name))))))
      .node(),
    ]
  }

  public buildUpdateManyArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('data')
      .type(NonNullType.node(NamedType.node(this.namer.buildUpdateInputName(name))))
      .node(),
      new InputValueDefinition()
      .name('where')
      .type(NonNullType.node(NamedType.node(this.namer.buildWhereInputName(name))))
      .node(),
    ]
  }

  public buildDeleteManyArguments(name: string): InputValueDefinitionNode[] {
    return [
      new InputValueDefinition()
      .name('where')
      .type(NonNullType.node(NamedType.node(this.namer.buildWhereInputName(name))))
      .node(),
    ]
  }
}
