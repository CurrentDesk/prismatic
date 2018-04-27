import {
  TypeNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  DirectiveNode,
} from 'graphql/language'

export type WrappingTypeNode = NonNullTypeNode | ListTypeNode

export interface Unwrapped {
  required: boolean
  list: boolean
  namedType: NamedTypeNode
}

export function isWrappingType(type: TypeNode): type is WrappingTypeNode {
  return (type as WrappingTypeNode).type !== undefined
}

export function getNamedType(type: TypeNode): NamedTypeNode {
  if (isWrappingType(type)) {
    return getNamedType(type.type)
  }

  return type
}

export function unwrap(type: TypeNode, info: Unwrapped = {} as Unwrapped): Unwrapped {
  if (info.required === undefined) {
    info.required = type.kind === 'NonNullType'
  }

  if (type.kind === 'ListType') {
    info.list = true
  }

  if (isWrappingType(type)) {
    return unwrap(type.type, info)
  }

  info.namedType = type

  return info
}

export function hasDirective(directives: ReadonlyArray<DirectiveNode> | undefined, name: string): boolean {
  return !!directives && directives.some(({ name: { value } }) => value === name)
}
