
const { splitter, collect } = require('../src/')
const path = require('path')
const should = require('should')

const moksDir = path.join(__dirname, 'mocks')

describe('serach and join schemas', () => {

  it ('should join all graphql files', async () => {
    const res = await collect(moksDir)
    should(res).be.Object().and.have.properties(['changePassword', 'getProfile', 'login', 'register'])
    should(res.login).be.eql('mutation login($uid: String!, $password: String!) { login(uid: $uid, password: $password) { ...jwtToken } } fragment jwtToken on JwtToken { token refreshToken type }')
    should(res.getProfile).be.eql('query getProfile { profile { ...userFields } } fragment userFields on User { id username email firstname lastname fullname avatar { ...avatarFields } account_status options } fragment avatarFields on Avatar { large original thumbnail normal small }')
    should(res.register).be.eql('mutation register($username: String, $email: String!, $password: String!, $firstname: String, $lastname: String) { register(username: $username, email: $email, password: $password, firstname: $firstname, lastname: $lastname) { ...jwtToken } } fragment jwtToken on JwtToken { token refreshToken type }')
  })

  it ('should join and collect movie files', async () => {
    const res = await collect(moksDir + '/movie')
    should(res).be.Object().and.have.properties(['ListMovies'])
    should(res.ListMovies).be.eql('query ListMovies { allFilms { films { ...Movie } } } fragment Movie on Film { id title director planetConnection { planets { ...Place } } } fragment Place on Planet { name climates }')
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
})
