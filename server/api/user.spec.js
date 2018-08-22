const { expect } = require('chai')
const request = require('supertest')
const {User, db} = require('../../database')
const app = require('../index')


describe('User routes', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('/api/user', () => {
    const Fake = 'fake'
    const Artist = 'Artist'
    const fakeArtistEmail = 'fakeArtist'
    const password = '12345678'

    beforeEach(() => {
      return User.create({
        firstName: Fake,
        lastName: Artist,
        email: fakeArtistEmail,
        password: password,
        terms: true
      })
    })

    it('GET /api/user/:email', async () => {
      const res = await request(app)
        .get(`/api/user/${fakeArtistEmail}`)
        .set('Accept', 'application/json')
        .expect(200)
        
        expect(res.body).to.be.an('array')
        expect(res.body[0].email).to.be.equal(fakeArtistEmail)
    })


    it('POST /signup', async () => {
      const newUser = {
        firstName: 'Fake',
        lastName: 'Artist',
        email: 'fakeArtistEmail',
        terms: true
      }

      const res = await request(app)
        .post('/api/user/signup')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /json/)
      
      expect(res.body.email).to.be.equal('fakeArtistEmail')
    })

    it('PUT /login correct info', async () => {
      const loginInfo = {
        email: fakeArtistEmail,
        password: '12345678'
      }

      const res = await request(app)
        .put('/api/user/login')
        .send(loginInfo)
        .expect('Content-Type', /json/)
    })

    it('PUT /login incorrect userName', async () => {
      const loginInfo = {
        password: '12345678'
      }

      const res = await request(app)
        .put('/api/user/login')
        .send(loginInfo)
        .expect('Content-Type', /text/)
        .expect(401)
        expect(res.text).to.be.equal('Wrong username')

    })

    it('PUT /login incorrect password', async () => {
      const loginInfo = {
        email: fakeArtistEmail,
        password: '12345679'
      }

      const res = await request(app)
        .put('/api/user/login')
        .send(loginInfo)
        .expect('Content-Type', /text/)
        .expect(401)
        expect(res.text).to.be.equal('Wrong username and/or password')
    })


    it('Put /update', async () => {
      const updateUser = {
        id: 1,
        firstName: "fake",
        lastName: "artist",
        email: "email",
        password: "87654321"
      }

      const res = await request(app)
        .put('/api/user/update')
        .send(updateUser)
        .expect(200)

        console.log(res.body)
        expect(res.body.firstName).to.be.equal("fake")
        expect(res.body.lastName).to.be.equal("artist")
        expect(res.body.email).to.be.equal("email")
    })

    it('Put /update fails when user doesn\'t exist', async () => {
      const updateUser = {
        id: 2,
        firstName: "fake",
        lastName: "artist",
        email: "email",
        password: "87654321"
      }

      const res = await request(app)
        .put('/api/user/update')
        .send(updateUser)
        .expect(500)

    })

  })//end /api/users/
})