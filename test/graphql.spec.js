
const { splitter, collect } = require('../src/')
const path = require('path')
const should = require('should')

const moksDir = path.join(__dirname, 'mocks')

describe('serach and join schemas', () => {

  it ('should join all graphql files', () => {
    const res = collect(moksDir)
    should(res).be.Object().and.have.properties(['changePassword', 'getProfile', 'login', 'register'])
    should(res.login).be.eql('mutation login($uid: String!, $password: String!) {\n  login(uid: $uid, password: $password) {\n    ...jwtToken\n  }\n}\n\nfragment jwtToken on JwtToken {\n  token\n  refreshToken\n  type\n}\n')
    should(res.getProfile).be.eql('query getProfile {\n  profile {\n    ...userFields\n  }\n}\n\nfragment userFields on User {\n  id\n  username\n  email\n  firstname\n  lastname\n  fullname\n  avatar {\n    ...avatarFields\n  }\n  account_status\n  options\n}\n\nfragment avatarFields on Avatar {\n  large\n  original\n  thumbnail\n  normal\n  small\n}\n')
  })

  it ('should join and collect movie files', () => {
    const res = collect(moksDir + '/movie')
    should(res).be.Object().and.have.properties(['ListMovies'])
  })

  it ('should return empty object when no one file was found', () => {
    const res = collect(moksDir + '/empty')
    should(res).be.Object().and.empty()
  })

  it ('should join all graphql files', () => {
    try {
      let res = collect(moksDir + '/nonexists')
      should(true).be.false()
    } catch (e) {
      should(e.message).startWith('ENOENT: no such file or directory')
    }
  })
})
