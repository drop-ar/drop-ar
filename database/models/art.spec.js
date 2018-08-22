const {expect} = require('chai')
const db = require('../database')
const Art = require('./art')
const Sequelize = require('sequelize')

describe('Art model', () => {
  beforeEach(() => {
    return db.sync({force: true})
  })

  describe('model properties', () => {
    let art

    beforeEach(async () => {
      art = await Art.create({
        artPiece: {
          "art": "SomeArt"
        },
        description: 'fake art',
      })
    })

    it('returns true if model has artPiece property', () => {
      expect(art).to.have.property('artPiece')
    })
 
    it('returns true if model has description property', () => {
      expect(art).to.have.property('description')
    })

    it('returns true if description is a string', () => {
      expect(art.description).to.be.a('string')
    })

  })
})