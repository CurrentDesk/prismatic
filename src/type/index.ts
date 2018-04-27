import {
  isObjectType,
  isListType,
  isWrappingType,
} from 'graphql/type'

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
