const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
const restaurantSeeders = require('../../restaurant.json').results


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
  console.log('mongoDB error!')
})
db.once('open', () => {
  // restaurantSeeders.forEach(restaurant => {
  //   Restaurant.create({
  //     name: `${restaurant.name}`,
  //     name_en: `${restaurant.name_en}`,
  //     category: `${restaurant.category}`,
  //     image: `${restaurant.image}`,
  //     location: `${restaurant.location}`,
  //     phone: `${restaurant.phone}`,
  //     google_map: `${restaurant.google_map}`,
  //     rating: `${restaurant.rating}`,
  //     description: `${restaurant.description}`
  //   })
  // })
  Restaurant.create(restaurantSeeders)
    .then(() => {
      console.log('Seed data is done!')
      db.close()
    })
    .catch(error => console.log(error))
})