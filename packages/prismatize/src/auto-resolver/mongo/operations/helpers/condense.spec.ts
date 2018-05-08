import { condense } from './condense'
describe('condense', () => {
  it('should usurp create', () => {
    const test = {
      blah: {
        create: {
          name: 'steve'
        }
      }
    }
    const expected = {
      blah: {
        name: 'steve'
      }
    }
    expect(condense(test)).toMatchObject(expected)
  })
})
