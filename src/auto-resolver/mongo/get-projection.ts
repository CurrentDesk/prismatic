import {
  FieldNode,
  SelectionSetNode,
} from 'graphql/language'
import { GraphQLResolveInfo } from 'graphql/type'

export type Projection = { [key: string]: 0 | 1 }

export function getProjection(meta: GraphQLResolveInfo): Projection {
  return meta.fieldNodes
  .filter(node => node.selectionSet !== undefined)
  .reduce((projection, { selectionSet }) => {
    const { selections } = selectionSet as SelectionSetNode

    selections
    .filter(({ kind }) => kind === 'Field')
    .forEach(({ name: { value: name } }: FieldNode) => projection[name] = 1)

    return projection
  }, {})
}
