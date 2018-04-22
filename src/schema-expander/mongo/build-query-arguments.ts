import { InputValueDefinitionNode } from 'graphql/language'

import {
  NamedType,
  NonNullType,
  InputValueDefinition,
} from '../../builders'

import { whereInputName } from './build-where-input'
import { orderByInputName } from './build-order-by-input'
import { whereUniqueInputName } from './build-where-unique-input'

export function buildWhereArguments(name: string): InputValueDefinitionNode[] {
  return [
    new InputValueDefinition()
    .name('where')
    .type(NamedType.node(whereInputName(name)))
    .node(),
    new InputValueDefinition()
    .name('orderBy')
    .type(NamedType.node(orderByInputName(name)))
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

export function buildWhereUniqueArguments(name: string): InputValueDefinitionNode[] {
  return [
    new InputValueDefinition()
    .name('where')
    .type(NonNullType.node(NamedType.node(whereUniqueInputName(name))))
    .node(),
  ]
}
