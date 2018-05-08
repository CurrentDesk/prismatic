import { InputValueDefinitionNode } from 'graphql/language'

import { InputValueDefinition } from './input-value-definition'
import { NamedType } from './named-type'
import { Directive } from './directive'

describe('InputValueDefinition', () => {
  it('should build a minimal InputValueDefinitionNode', () => {
    const expected: InputValueDefinitionNode = {
      kind: 'InputValueDefinition',
      name: {
        kind: 'Name',
        value: 'foo',
      },
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'String',
        },
      },
    }
    const inputValueDefinition: InputValueDefinitionNode = new InputValueDefinition()
    .name('foo')
    .type(
      new NamedType()
      .name('String')
      .node()
    )
    .node()

    expect(inputValueDefinition).toEqual(expected)
  })

  it('should build a minimal InputValueDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: InputValueDefinitionNode = {
      kind: 'InputValueDefinition',
      name: {
        kind: 'Name',
        value: 'foo',
      },
      type: {
        kind: 'NamedType',
        name: {
          kind: 'Name',
          value: 'String',
        },
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
    const inputValueDefinition: InputValueDefinitionNode = new InputValueDefinition()
    .name('foo')
    .type(
      new NamedType()
      .name('String')
      .node()
    )
    .description('This is a description')
    .directives(() => [
      new Directive()
      .name('unique')
      .node()
    ])
    .node()

    expect(inputValueDefinition).toEqual(expected)
  })
})
