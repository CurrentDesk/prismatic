import { mapOrderBy } from './map-order-by'

describe('mapOrderBy', () => {

  it('should map ascending to 1', () => {
    const ascending = 'blah_ASC'
    expect(mapOrderBy(ascending)).toMatchObject(['blah', 1])
  })

  it('should map descending to -1', () => {
    const descending = 'blah_DESC'
    expect(mapOrderBy(descending)).toMatchObject(['blah', -1])
  })
  
})
