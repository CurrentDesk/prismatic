import { NonNullTypeNode } from 'graphql/language'

import { NonNullType } from './non-null-type'
import { NamedType } from './named-type'

describe('NonNullType', () => {
  it('should build a NonNullTypeNode', () => {
    const expected: NonNullTypeNode = {
      kind: 'NonNullType',
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'foo',
        },
      },
    }
    const nonNullType: NonNullTypeNode = new NonNullType()
    .type(
      new NamedType()
      .name('foo')
      .node()
    )
    .node()

    expect(nonNullType).toEqual(expected)
  })
})
