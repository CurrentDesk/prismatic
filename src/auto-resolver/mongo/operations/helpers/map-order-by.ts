export function mapOrderBy(orderBy: string): [string, number] {
  const [field, direction] = orderBy.split('_')

  return [field, direction === 'ASC' ? 1 : -1]
}
