// 載入express和設定port
const express = require('express')
// 載入mongoose
const mongoose = require('mongoose')
// 載入handlebars
const exphbs = require('express-handlebars')
// 載入restaurant model
const Restaurant = require('./models/restaurant')
// 載入Body-parser
const bodyParser = require('body-parser')


// 使用express
const app = express()
// 設定伺服器參數
const port = 3000


// 設定樣版引擎
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
// 啟用handlebars這個樣版引擎
app.set('view engine', 'handlebars')


// <---設定資料庫--->
// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// 取得資料庫的狀態
const db = mongoose.connection


// 設定靜態檔案的位置
app.use(express.static('public'))
// 使用body-parser
app.use(bodyParser.urlencoded({ extended: true }))


// <---設定路由--->
// 檢查資料快連線狀態，連線異常
db.on('error', () => {
  console.log('mongoDB error!')
})
// 檢查資料快連線狀態，連線正常
db.once('open', () => {
  console.log('mongoDB connected!')
})

// 主頁面路由設定
app.get('/', (req, res) => {
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// 新餐廳路由
// 不能放在show路由下面，為什麼，有無其他方法避免？
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

// 將新增的資料存資料庫
// 都是以text輸入也沒問題？
// 為什麼不post/restaurants/new
app.post('/restaurants', (req, res) => {
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
app.get('/restaurants/:id', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

// edit頁面路由設定
app.get('/restaurants/:id/edit', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('edit', { restaurant }))
    .catch(error => console.log(error))
})

// 控制edit後的路由
app.post('/restaurants/:id/edit', (req, res) => {
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
app.post('/restaurants/:id/delete', (req, res) => {
  const id = req.params.id
  return Restaurant.findById(id)
    .then(restaurant => restaurant.remove())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})


// 搜尋頁面路由設定
app.get('/search', (req, res) => {

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

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})