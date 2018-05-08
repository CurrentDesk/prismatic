import { EnumValueDefinitionNode } from 'graphql/language'

import { EnumValueDefinition } from './enum-value-definition'
import { Directive } from './directive'

describe('EnumValueDefinition', () => {
  it('should build a minimal EnumValueDefinitionNode', () => {
    const expected: EnumValueDefinitionNode = {
      kind: 'EnumValueDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
    }
    const enumValueDefinition: EnumValueDefinitionNode = new EnumValueDefinition()
    .name('Foo')
    .node()

    expect(enumValueDefinition).toEqual(expected)
  })

  it('should build an EnumValueDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: EnumValueDefinitionNode = {
      kind: 'EnumValueDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
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
            value: 'cool',
          },
        },
      ],
    }
    const enumValueDefinition: EnumValueDefinitionNode = new EnumValueDefinition()
    .name('Foo')
    .description('This is a description')
    .directives(() => [
      new Directive()
      .name('cool')
      .node()
    ])
    .node()

    expect(enumValueDefinition).toEqual(expected)
  })
})
