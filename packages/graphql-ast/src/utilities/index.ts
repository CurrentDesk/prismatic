import {
  TypeNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  DirectiveNode,
} from 'graphql/language'

export type WrappingTypeNode = NonNullTypeNode | ListTypeNode

export interface TypeContext {
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

export function unwrap(type: TypeNode, context: TypeContext = {} as TypeContext): TypeContext {
  if (context.required === undefined) {
    context.required = type.kind === 'NonNullType'
  }

  if (type.kind === 'ListType') {
    context.list = true
  }

  if (isWrappingType(type)) {
    return unwrap(type.type, context)
  }

  context.namedType = type

  return context
}

export function hasDirective(directives: ReadonlyArray<DirectiveNode> | undefined, name: string): boolean {
  return directives !== undefined && directives.some(({ name: { value } }) => value === name)
}
