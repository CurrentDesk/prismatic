import { DirectiveNode } from 'graphql/language'

import { Directive } from './directive'

describe('Directive', () => {
  it('should build a DirectiveNode', () => {
    const exptected: DirectiveNode = {
      kind: 'Directive',
      name: {
        kind: 'Name',
        value: 'foo',
      },
    }
    const directive: DirectiveNode = new Directive()
    .name('foo')
    .node()

    expect(directive).toEqual(exptected)
  })
})
