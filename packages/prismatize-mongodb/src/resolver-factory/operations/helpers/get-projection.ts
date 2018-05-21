import {
  FieldNode,
  SelectionSetNode,
  InlineFragmentNode,
  FragmentSpreadNode,
} from 'graphql/language'
import { GraphQLResolveInfo } from 'graphql/type'

export type Projection = { [key: string]: 0 | 1 }

export function getProjection(
  {
    fieldNodes,
    fragments,
  }: GraphQLResolveInfo
): Projection {
  function fromSelections(nodes: ReadonlyArray<FieldNode | FragmentSpreadNode | InlineFragmentNode>, projection) {
    nodes.forEach(selection => {
      switch (selection.kind) {
        case 'Field': {
          projection[selection.name.value] = 1
          break
        }
        case 'FragmentSpread': {
          const { selections } = fragments[selection.name.value].selectionSet
          fromSelections(selections, projection)
          break
        }
        case 'InlineFragment': {
          // TODO: implement this
          throw new Error('InlineFragment not yet supported')
        }
        default: {
          throw new Error('Unknown node kind')
        }
      }
    })
  }

  return fieldNodes
  .filter(node => node.selectionSet !== undefined)
  .reduce((projection, { selectionSet }) => {
    const { selections } = selectionSet as SelectionSetNode

    fromSelections(selections, projection)

    return projection
  }, {})
}
