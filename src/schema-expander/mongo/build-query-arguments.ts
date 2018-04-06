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
    .type(
      new NamedType()
      .name(whereInputName(name))
      .node()
    )
    .node(),
    new InputValueDefinition()
    .name('orderBy')
    .type(
      new NamedType()
      .name(orderByInputName(name))
      .node()
    )
    .node(),
    new InputValueDefinition()
    .name('skip')
    .type(
      new NamedType()
      .name('Int')
      .node()
    )
    .node(),
    new InputValueDefinition()
    .name('first')
    .type(
      new NamedType()
      .name('Int')
      .node()
    )
    .node(),
    new InputValueDefinition()
    .name('last')
    .type(
      new NamedType()
      .name('Int')
      .node()
    )
    .node(),
  ]
}

export function buildWhereUniqueArguments(name: string): InputValueDefinitionNode[] {
  return [
    new InputValueDefinition()
    .name('where')
    .type(
      new NonNullType()
      .type(
        new NamedType()
        .name(whereUniqueInputName(name))
        .node()
      )
      .node()
    )
    .node(),
  ]
}
