import { NamedTypeNode } from 'graphql/language'

import { NamedType } from './named-type'

describe('NamedType', () => {
  it('should build a NamedTypeNode', () => {
    const expected: NamedTypeNode = {
      kind: 'NamedType',
      name: {
        kind: 'Name',
        value: 'foo',
      },
    }
    const namedType: NamedTypeNode = new NamedType()
    .name('foo')
    .node()

    expect(namedType).toEqual(expected)
  })
})
