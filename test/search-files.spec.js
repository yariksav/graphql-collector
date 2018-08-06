
const { searchFiles, searchSchemas } = require('../src/utils')
const path = require('path')
const should = require('should')


const moksDir = path.join(__dirname, 'mocks')

describe('serach and join schemas', () => {

  it('should search all graphql files', () => {
    const res = searchFiles(moksDir)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThanOrEqual(6)
  })

  it ('should join all graphql files', () => {
    const res = searchSchemas(moksDir)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThanOrEqual(6)
  })
})
