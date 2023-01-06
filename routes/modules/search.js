const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 搜尋頁面路由設定
router.get('/search', (req, res) => {

  const keyword = req.query.keyword

  return Restaurant.find()
    .lean()
    .then(restaurants => {
      return restaurants.filter(restaurant => {
        if (restaurant.name.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
          return true
        } else if (restaurant.category.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
          return true
        }
      })
    })
    .then((restaurants, keyword) => res.render('index', { restaurants, keyword }))
})

module.exports = router