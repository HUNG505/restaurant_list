const Restaurant = require('../restaurant')
const restaurantSeeders = require('../../restaurant.json').results
require('../../config/mongoose')

const db = require('../../config/mongoose')

db.once('open', () => {

  Restaurant.create(restaurantSeeders)
    .then(() => {
      console.log('Seed data is done!')
      db.close()
    })
    .catch(error => console.log(error))
})