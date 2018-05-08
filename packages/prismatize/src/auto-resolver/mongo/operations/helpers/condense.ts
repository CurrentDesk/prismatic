export type Data = { [key: string]: any }

// Maps creation mutation objects to handle the creation...
// ...of related objects which are actually embedded
export function condense(data: Data): Data {
  return Object.entries(data).reduce((result, [key, value]) => {
    if (value.create) {
      result[key] = value['create']
    } else {
      result[key] = value
    }

    return result
  }, {})
}
