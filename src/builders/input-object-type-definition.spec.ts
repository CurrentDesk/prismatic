import { InputObjectTypeDefinitionNode } from 'graphql/language'

import { InputObjectTypeDefinition } from './input-object-type-definition'
import { InputValueDefinition } from './input-value-definition'
import { Directive } from './directive'
import { NamedType } from './named-type'

describe('InputObjectTypeDefinition', () => {
  it('should build a minimal InputObjectTypeDefinitionNode', () => {
    const expected: InputObjectTypeDefinitionNode = {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
    }
    const inputObjectTypeDefinition: InputObjectTypeDefinitionNode = new InputObjectTypeDefinition()
    .name('Foo')
    .node()

    expect(inputObjectTypeDefinition).toEqual(expected)
  })

  it('should build an InputObjectTypeDefinitionNode with fields', () => {
    const expected: InputObjectTypeDefinitionNode = {
      kind: 'InputObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
      fields: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'bar'
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String'
            }
          }
        }
      ]
    }
    const inputObjectTypeDefinition: InputObjectTypeDefinitionNode = new InputObjectTypeDefinition()
    .name('Foo')
    .fields(() => [
      new InputValueDefinition()
      .name('bar')
      .type(
        new NamedType()
        .name('String')
        .node()
      )
      .node()
    ])
    .node()

    expect(inputObjectTypeDefinition).toEqual(expected)
  })

  it('should build an InputObjectTypeDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: InputObjectTypeDefinitionNode = {
      kind: 'InputObjectTypeDefinition',
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
            value: 'awesome',
          },
        },
      ]
    }
    const inputObjectTypeDefinition: InputObjectTypeDefinitionNode = new InputObjectTypeDefinition()
    .name('Foo')
    .description('This is a description')
    .directives(() => [
      new Directive()
      .name('awesome')
      .node()
    ])
    .node()

    expect(inputObjectTypeDefinition).toEqual(expected)
  })
})
