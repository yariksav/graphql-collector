
const { splitter, collect } = require('../src/')
const path = require('path')
const should = require('should')

const moksDir = path.join(__dirname, 'mocks')

describe('serach and join schemas', () => {

  it ('should join all graphql files', async () => {
    const res = await collect(moksDir)
    should(res).be.Object().and.have.properties(['changePassword', 'getProfile', 'login', 'register'])
    expect(res).toMatchSnapshot()
  })

  it ('should join and collect movie files', async () => {
    const res = await collect(moksDir + '/movie')
    should(res).be.Object().and.have.properties(['ListMovies'])
    expect(res).toMatchSnapshot()
  })

  it ('should return empty object when no one file was found', async () => {
    const res = await collect(moksDir + '/empty')
    should(res).be.Object().and.empty()
  })

  it ('should join all graphql files', async () => {
    try {
      await collect(moksDir + '/nonexists')
      should(true).be.false()
    } catch (e) {
      should(e.message).startWith('ENOENT: no such file or directory')
    }
  })

  it ('should return', async () => {
    const res = await collect(moksDir + '/user')
    expect(res).toMatchSnapshot()
  })
})
