import { ArgumentNode } from 'graphql/language'

import { Argument } from './argument'

describe('Argument', () => {
  it('should build an ArgumentNode', () => {
    const expected: ArgumentNode = {
      kind: 'Argument',
      name: {
        kind: 'Name',
        value: 'foo',
      },
      value: {
        kind: 'IntValue',
        value: '1',
      },
    }
    const argument: ArgumentNode = new Argument()
    .name('foo')
    .value({
      kind: 'IntValue',
      value: '1',
    })
    .node()

    expect(argument).toEqual(expected)
  })
})
