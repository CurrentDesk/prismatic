import { ListTypeNode } from 'graphql/language'

import { ListType } from './list-type'
import { NamedType } from './named-type'

describe('ListType', () => {
  it('should build a ListTypeNode', () => {
    const expected: ListTypeNode = {
      kind: 'ListType',
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'foo',
        },
      },
    }
    const listType: ListTypeNode = new ListType()
    .type(
      new NamedType()
      .name('foo')
      .node()
    )
    .node()

    expect(listType).toEqual(expected)
  })
})
