const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 新餐廳路由
// 不能放在show路由下面，為什麼，有無其他方法避免？
router.get('/new', (req, res) => {
  return res.render('new')
})

// 將新增的資料存資料庫
// 都是以text輸入也沒問題？
// 為什麼不post/restaurants/new
router.post('/', (req, res) => {
  const name = req.body.name
  const category = req.body.category
  const rating = req.body.rating
  const location = req.body.location
  const google_map = req.body.google_map
  const phone = req.body.phone
  const description = req.body.description

  return Restaurant.create({ name, category, rating, location, google_map, phone, description })
    .then(res.redirect('/'))
    .catch(error => console.log(error))
})

// show頁面路由設定
router.get('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

// edit頁面路由設定
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 控制edit後的路由
router.put('/:id', (req, res) => {
  const id = req.params.id
  const name = req.body.name
  const category = req.body.category
  const rating = req.body.rating
  const location = req.body.location
  const google_map = req.body.google_map
  const phone = req.body.phone
  const description = req.body.description

  return Restaurant.findById(id)
    .then(restaurant => {
      restaurant.name = name
      restaurant.category = category
      restaurant.rating = rating
      restaurant.location = location
      restaurant.google_map = google_map
      restaurant.phone = phone
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

// delete路由設定
router.delete('/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

module.exports = router