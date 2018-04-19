import { ObjectTypeDefinitionNode } from 'graphql/language'

import { ObjectTypeDefinition } from './object-type-definition'
import { FieldDefinition } from './field-definition'
import { NamedType } from './named-type'

describe('ObjectTypeDefinition', () => {
  it('should build a minimal ObjectTypeDefinitionNode', () => {
    const expected: ObjectTypeDefinitionNode = {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
    }
    const objectTypeDefinition: ObjectTypeDefinitionNode = new ObjectTypeDefinition()
    .name('Foo')
    .node()

    expect(objectTypeDefinition).toEqual(expected)
  })

  it('should build an ObjectTypeDefinitionNode', () => {
    const expected: ObjectTypeDefinitionNode = {
      kind: 'ObjectTypeDefinition',
      name: {
        kind: 'Name',
        value: 'Foo',
      },
      fields: [
        {
          kind: 'FieldDefinition',
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
      interfaces: [
        {
          kind: 'NamedType',
          name: {
            kind: 'Name',
            value: 'Node',
          },
        },
      ],
    }
    const objectTypeDefinition: ObjectTypeDefinitionNode = new ObjectTypeDefinition()
    .name('Foo')
    .fields(() => [
      new FieldDefinition()
      .name('bar')
      .type(
        new NamedType()
        .name('String')
        .node()
      )
      .node()
    ])
    .interfaces(() => [
      new NamedType()
      .name('Node')
      .node()
    ])
    .node()

    expect(objectTypeDefinition).toEqual(expected)
  })
})
