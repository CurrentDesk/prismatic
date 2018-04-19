import { EnumTypeDefinitionNode } from 'graphql/language'

import { EnumTypeDefinition } from './enum-type-definition'
import { EnumValueDefinition } from './enum-value-definition'
import { Directive } from './directive'

describe('EnumTypeDefinition', () => {
  it('should build a minimal EnumTypeDefinitionNode', () => {
    const expected: EnumTypeDefinitionNode = {
      kind: 'EnumTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
    }
    const enumTypeDefintion: EnumTypeDefinitionNode = new EnumTypeDefinition()
    .name('Foo')
    .node()

    expect(enumTypeDefintion).toEqual(expected)
  })

  it('should build an EnumTypeDefinitionNode with values', () => {
    const expected: EnumTypeDefinitionNode = {
      kind: 'EnumTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
      values: [
        {
          kind: 'EnumValueDefinition',
          name: {
            kind: 'Name',
            value: 'Bar'
          }
        }
      ]
    }
    const enumTypeDefintion: EnumTypeDefinitionNode = new EnumTypeDefinition()
    .name('Foo')
    .values([
      new EnumValueDefinition()
      .name('Bar')
      .node()
    ])
    .node()

    expect(enumTypeDefintion).toEqual(expected)
  })

  it('should build an EnumTypeDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: EnumTypeDefinitionNode = {
      kind: 'EnumTypeDefinition',
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
            value: 'loud',
          },
        },
      ],
    }
    const enumTypeDefintion: EnumTypeDefinitionNode = new EnumTypeDefinition()
    .name('Foo')
    .description('This is a description')
    .directives(() => [
      new Directive()
      .name('loud')
      .node()
    ])
    .node()

    expect(enumTypeDefintion).toEqual(expected)
  })
})
