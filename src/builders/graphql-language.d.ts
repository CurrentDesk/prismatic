import { Location } from 'graphql/language'

declare module 'graphql/language' {
  interface StringValueNode {
    kind: 'StringValue'
    value: String
    block?: boolean
    loc?: Location
  }
}
