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

    beforeEach(() => {
      return User.create({
        firstName: Fake,
        lastName: Artist,
        email: fakeArtistEmail,
        terms: true
      })
    })

    it('GET /api/user', async () => {
      const res = await request(app)
        .get('/api/user')
        .expect(200)
      
      expect(res.body).to.be.an('array')
      expect(res.body[0].email).to.be.equal(fakeArtistEmail)
    })

    // it('GET /api/user/:email', async () => {
    //   const res = await request(app)
    //     .get('/api/user/md@email.com')
    //     .set('Accept', 'application/json')
    //     .expect(200)
    //   console.log(res.body)
    //   expect(res.body).to.be.an('array')
      // expect(res.body[0].email).to.be.equal(fakeArtistEmail)
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

  })//end /api/users/
})