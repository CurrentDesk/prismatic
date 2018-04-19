import { StringValueNode } from 'graphql/language'

import { StringValue } from './string-value'

describe('StringValue', () => {
  it('should build a StringValueNode', () => {
    const expected: StringValueNode = {
      kind: 'StringValue',
      value: 'this is a string',
    }
    const stringValue: StringValueNode = new StringValue()
    .value('this is a string')
    .node()

    expect(stringValue).toEqual(expected)
  })

  it('should build a StringValueNode for block comment', () => {
    const expected: StringValueNode = {
      kind: 'StringValue',
      value: 'this is a string',
      block: true,
    }
    const stringValue: StringValueNode = new StringValue()
    .value('this is a string')
    .block(true)
    .node()

    expect(stringValue).toEqual(expected)
  })
})
