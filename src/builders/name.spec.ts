import { NameNode } from 'graphql/language'

import { Name } from './name'

describe('Name', () => {
  it('should build a NameNode', () => {
    const expected: NameNode = {
      kind: 'Name',
      value: 'foo',
    }
    const name: NameNode = new Name().value('foo').node()

    expect(name).toEqual(expected)
  })
})
