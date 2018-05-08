import { DocumentNode } from 'graphql/language'

import { Document } from './document'
import { ScalarTypeDefinition } from './scalar-type-definition'

describe('Document', () => {
  it('should allow mutation of the definitions list', () => {
    const expected: DocumentNode = {
      kind: 'Document',
      definitions: [
        {
          kind: 'ScalarTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Foo',
          },
        },
        {
          kind: 'ScalarTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Bar',
          },
        },
      ],
    }
    const original: DocumentNode = {
      kind: 'Document',
      definitions: [
        {
          kind: 'ScalarTypeDefinition',
          name: {
            kind: 'Name',
            value: 'Foo',
          },
        },
      ],
    }
    const document: DocumentNode = new Document(original)
    .definitions(definition => {
      return definition.concat(
        new ScalarTypeDefinition()
        .name('Bar')
        .node()
      )
    })
    .node()

    expect(document).toEqual(expected)
  })
})
