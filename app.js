// 載入express和設定port
const express = require('express')
// 載入mongoose
const mongoose = require('mongoose')
// 載入handlebars
const exphbs = require('express-handlebars')
// 載入restaurant model
const Restaurant = require('./models/restaurant')


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


// 載入JOSN資料
// const restaurantList = require('./restaurant.json')


// 設定靜態檔案的位置
app.use(express.static('public'))
// 使用body - parser
// app.use(bodyParser.urlencoded({ extended: true }))


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
  // res.render('index', { restaurants: restaurantList.results })
  Restaurant.find()
    .lean()
    .then(restaurants => res.render('index', { restaurants }))
    .catch(error => console.log(error))
})

// show頁面路由設定
app.get('/restaurants/:id', (req, res) => {

  // 用find找到被點擊的物件
  // const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurants_id)

  // 完整寫法是res.render('show', { restaurant: restaurant })，但可透過ES6的物件擴展(object literal extension)縮寫成以下
  // res.render('show', { restaurant })

  const id = req.params.id
  return Restaurant.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.log(error))

})

// 搜尋頁面路由設定
app.get('/search', (req, res) => {

  const keyword = req.query.keyword
  //   const restaurants = restaurantList.results.filter(restaurant => {
  //     // 透過replace把字串中的空白格消除，透過toLowerCase把字母都變成小寫
  //     // 若keyword包含在name裡面就回傳true，若keyword包含在category裡面就回傳true，這樣搜尋欄位會同時搜尋「餐廳名稱」和「餐廳類別」
  //     if (restaurant.name.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
  //       return true
  //     } else if (restaurant.category.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
  //       return true
  //     }
  // })

  const restaurants = Restaurant.find()
    .lean()
    .then(restaurantData => {
      restaurantData.filter(restaurant => {
        if (restaurant.name.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
          return true
        } else if (restaurant.category.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
          return true
        }
      })
    })


  // 完整寫法是res.render('index', { restaurants: restaurants, keyword: keyword })，但可透過ES6的物件擴展(object literal extension)縮寫成以下
  res.render('index', { restaurants, keyword })
})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})