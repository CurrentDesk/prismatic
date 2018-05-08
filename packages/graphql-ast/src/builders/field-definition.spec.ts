import { FieldDefinitionNode } from 'graphql/language'

import { FieldDefinition } from './field-definition'
import { InputValueDefinition } from './input-value-definition'
import { NamedType } from './named-type'
import { Directive } from './directive'

describe('FieldDefinition', () => {
  it('should build a minimal FieldDefinitionNode', () => {
    const expected: FieldDefinitionNode = {
      kind: 'FieldDefinition',
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
    const fieldDefinition: FieldDefinitionNode = new FieldDefinition()
    .name('foo')
    .type(
      new NamedType()
      .name('String')
      .node()
    )
    .node()

    expect(fieldDefinition).toEqual(expected)
  })

  it('should build a FieldDefinitionNode with arguments', () => {
    const expected: FieldDefinitionNode = {
      kind: 'FieldDefinition',
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
      arguments: [
        {
          kind: 'InputValueDefinition',
          name: {
            kind: 'Name',
            value: 'bar',
          },
          type: {
            kind: 'NamedType',
            name: {
              kind: 'Name',
              value: 'String',
            },
          },
        },
      ],
    }
    const fieldDefinition: FieldDefinitionNode = new FieldDefinition()
    .name('foo')
    .type(
      new NamedType()
      .name('String')
      .node()
    )
    .arguments(() => [
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

    expect(fieldDefinition).toEqual(expected)
  })

  it('should build a FieldDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: FieldDefinitionNode = {
      kind: 'FieldDefinition',
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
        value: 'This is a description.',
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
    const fieldDefinition: FieldDefinitionNode = new FieldDefinition()
    .name('foo')
    .type(
      new NamedType()
      .name('String')
      .node()
    )
    .description('This is a description.')
    .directives(() => [
      new Directive()
      .name('unique')
      .node()
    ])
    .node()

    expect(fieldDefinition).toEqual(expected)
  })
})
