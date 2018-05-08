import { ScalarTypeDefinitionNode } from 'graphql/language'

import { ScalarTypeDefinition } from './scalar-type-definition'
import { Directive } from './directive'

describe('ScalarTypeDefinition', () => {
  it('should build a minimal ScalarTypeDefinitionNode', () => {
    const expected: ScalarTypeDefinitionNode = {
      kind: 'ScalarTypeDefinition',
      name: {
        kind: 'Name',
        value: 'URL',
      },
    }
    const scalarTypeDefinition: ScalarTypeDefinitionNode = new ScalarTypeDefinition()
    .name('URL')
    .node()

    expect(scalarTypeDefinition).toEqual(expected)
  })

  it('should build a ScalarTypeDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: ScalarTypeDefinitionNode = {
      kind: 'ScalarTypeDefinition',
      name: {
        kind: 'Name',
        value: 'URL',
      },
      description: {
        kind: 'StringValue',
        value: 'This is a description',
        block: true,
      },
      directives: [
        {
          kind: 'Directive',
          name: {
            kind: 'Name',
            value: 'unique',
          },
        },
      ],
    }
    const scalarTypeDefinition: ScalarTypeDefinitionNode = new ScalarTypeDefinition()
    .name('URL')
    .description('This is a description')
    .directives(() => [
      new Directive()
      .name('unique')
      .node()
    ])
    .node()

    expect(scalarTypeDefinition).toEqual(expected)
  })
})
