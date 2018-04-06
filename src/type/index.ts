import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLInterfaceType,
  GraphQLUnionType,
  GraphQLInputObjectType,
  GraphQLNullableType,
} from 'graphql/type'

/**
 * These are predicates for each kind of GraphQL type.
 */

export function isScalarType(type: any): type is GraphQLScalarType {
  return type instanceof GraphQLScalarType
}

export function isObjectType(type: any): type is GraphQLObjectType {
  return type instanceof GraphQLObjectType
}

export function isInterfaceType(type: any): type is GraphQLInterfaceType {
  return type instanceof GraphQLInterfaceType
}

export function isUnionType(type: any): type is GraphQLUnionType {
  return type instanceof GraphQLUnionType
}

export function isEnumType(type: any): type is GraphQLEnumType {
  return type instanceof GraphQLEnumType
}

export function isInputObjectType(type: any): type is GraphQLInputObjectType {
  return type instanceof GraphQLInputObjectType
}

export function isListType(type: any): type is GraphQLList<any> {
  return type instanceof GraphQLList
}

export function isNonNullType(type: any): type is GraphQLNonNull<any> {
  return type instanceof GraphQLNonNull
}

export function isNullableType(type: any): type is GraphQLNullableType {
  return (
    isScalarType(type) ||
    isObjectType(type) ||
    isInterfaceType(type) ||
    isUnionType(type) ||
    isEnumType(type) ||
    isInputObjectType(type) ||
    isListType(type)
  )
}

export type GraphQLWrappingType = GraphQLList<any> | GraphQLNonNull<any>

export function isWrappingType(type): type is GraphQLWrappingType {
  return isListType(type) || isNonNullType(type)
}

export function isListOfObjectType(type): boolean {
  let unwrappedType = type
  let result = false

  while (isWrappingType(unwrappedType)) {
    if (isListType(unwrappedType)) {
      result = true
    }

    unwrappedType = unwrappedType.ofType
  }

  return result && isObjectType(unwrappedType)
}
