import { ObjectID } from 'mongodb'

import { Where } from '../../..'
import { MongoWhere } from '../../.'

import { mapWhere } from './map-where'

describe('mapWhere', () => {
  it('should pass simple query unchanged', () => {
    const given: Where = {
      foo: 'bar',
    }
    const expected: MongoWhere = {
      foo: 'bar',
    }
    expect(mapWhere(given)).toEqual(expected)
  })

  it('should map logical operator `AND` to `$and`', () => {
    const given: Where = {
      AND: [
        {
          foo: 'bar',
        },
        {
          bing: 'zap',
        },
      ],
    }
    const expected: MongoWhere = {
      $and: [
        {
          foo: 'bar',
        },
        {
          bing: 'zap',
        },
      ],
    }
    expect(mapWhere(given)).toEqual(expected)
  })

  it('should map logical operator `OR` to `$or`', () => {
    const given: Where = {
      OR: [
        {
          foo: 'bar',
        },
        {
          bing: 'zap',
        },
      ],
    }
    const expected: MongoWhere = {
      $or: [
        {
          foo: 'bar',
        },
        {
          bing: 'zap',
        },
      ],
    }
    expect(mapWhere(given)).toEqual(expected)
  })

  it('should map logical operator `NOR` to `$nor`', () => {
    const given: Where = {
      NOR: [
        {
          foo: 'bar',
        },
        {
          bing: 'zap',
        },
      ],
    }
    const expected: MongoWhere = {
      $nor: [
        {
          foo: 'bar',
        },
        {
          bing: 'zap',
        },
      ],
    }
    expect(mapWhere(given)).toEqual(expected)
  })

  it('should map nested where', () => {
    const given: Where = {
      OR: [
        {
          AND: [
            {
              foo: 'bar',
            },
            {
              bing: 'zap',
            },
          ],
        },
        {
          AND: [
            {
              fizz: 'pop',
            },
            {
              lorem: 'ipsum',
            },
          ],
        },
      ],
    }
    const expected: MongoWhere = {
      $or: [
        {
          $and: [
            {
              foo: 'bar',
            },
            {
              bing: 'zap',
            },
          ],
        },
        {
          $and: [
            {
              fizz: 'pop',
            },
            {
              lorem: 'ipsum',
            },
          ],
        },
      ],
    }

    expect(mapWhere(given)).toEqual(expected)
  })

  it('should map `id` to `_id`', () => {
    const mongoID = new ObjectID()
    const given: Where = {
      id: mongoID,
    }
    const expected: MongoWhere = {
      _id: mongoID,
    }
    expect(mapWhere(given)).toEqual(expected)
  })

  it('should map comparison operators', () => {
    const given: Where = {
      AND: [
        {
          foo_lt: 50
        },
        {
          foo_gt: 60
        },
      ]
    }
    const expected: MongoWhere = {
      $and: [
        {
          foo: {
            $lt: 50
          },
        },
        {
          foo: {
            $gt: 60
          },
        },
      ],
    }
    expect(mapWhere(given)).toEqual(expected)
  })
})
