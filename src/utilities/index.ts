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
  let unwrapped = type

  while (isWrappingType(unwrapped)) {
    unwrapped = unwrapped.type
  }

  return unwrapped
}

export function unwrap(type: TypeNode): Unwrapped {
  const required = type.kind === 'NonNullType'

  let namedType = type
  let list = false

  while (isWrappingType(namedType)) {
    if (namedType.kind === 'ListType') {
      list = true
    }

    namedType = namedType.type
  }

  return {
    list,
    required,
    namedType,
  }
}

export function hasDirective(directives: ReadonlyArray<DirectiveNode> | undefined, name: string): boolean {
  return !!directives && directives.some(({ name: { value } }) => value === name)
}
