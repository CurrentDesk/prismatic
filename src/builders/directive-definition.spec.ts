import { DirectiveDefinitionNode } from 'graphql/language'

import { DirectiveDefinition } from './directive-definition'
import { InputValueDefinition } from './input-value-definition'
import { NamedType } from './named-type'

describe('DirectiveDefinition', () => {
  it('should build a minimal DirectiveDefinitionNode', () => {
    const expected: DirectiveDefinitionNode = {
      kind: 'DirectiveDefinition',
      name: {
        kind: 'Name',
        value: 'embedded',
      },
      locations: [
        {
          kind: 'Name',
          value: 'OBJECT',
        },
        {
          kind: 'Name',
          value: 'FIELD_DEFINITION',
        },
      ],
    }
    const directiveDefinition: DirectiveDefinitionNode = new DirectiveDefinition()
    .name('embedded')
    .locations(['OBJECT', 'FIELD_DEFINITION'])
    .node()

    expect(directiveDefinition).toEqual(expected)
  })

  it('should build a DirectiveDefinitionNode with arguments', () => {
    const expected: DirectiveDefinitionNode = {
      kind: 'DirectiveDefinition',
      name: {
        kind: 'Name',
        value: 'embedded',
      },
      locations: [
        {
          kind: 'Name',
          value: 'OBJECT',
        },
        {
          kind: 'Name',
          value: 'FIELD_DEFINITION',
        },
      ],
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
    const directiveDefinition: DirectiveDefinitionNode = new DirectiveDefinition()
    .name('embedded')
    .locations(['OBJECT', 'FIELD_DEFINITION'])
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

    expect(directiveDefinition).toEqual(expected)
  })

  it('should build a DirectiveDefinitionNode with properties inherited from AbstractDefinition', () => {
    const expected: DirectiveDefinitionNode = {
      kind: 'DirectiveDefinition',
      name: {
        kind: 'Name',
        value: 'embedded',
      },
      locations: [
        {
          kind: 'Name',
          value: 'OBJECT',
        },
        {
          kind: 'Name',
          value: 'FIELD_DEFINITION',
        },
      ],
      description: {
        kind: 'StringValue',
        value: 'This is a description.',
        block: true,
      },
    }
    const directiveDefinition: DirectiveDefinitionNode = new DirectiveDefinition()
    .name('embedded')
    .locations(['OBJECT', 'FIELD_DEFINITION'])
    .description('This is a description.')
    .node()

    expect(directiveDefinition).toEqual(expected)
  })

  it('should not build a DirectiveDefinitionNode with directives', () => {
    const directiveDefinition = new DirectiveDefinition()

    expect(() => {
      directiveDefinition.directives()
    }).toThrow('Directives can\'t have directives')
  })
})
