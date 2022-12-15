// 載入express和設定port
const express = require('express')
const app = express()
const port = 3000

// 載入handlebars
const exphbs = require('express-handlebars')
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

// 載入JOSN資料
const restaurantList = require('./restaurant.json')


// 設定靜態檔案的位置
app.use(express.static('public'))

// 主頁面路由設定
app.get('/', (req, res) => {
  res.render('index', { restaurants: restaurantList.results })
})

// show頁面路由設定
app.get('/restaurants/:restaurants_id', (req, res) => {

  // 用find找到被點擊的物件
  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurants_id)

  // 完整寫法是res.render('show', { restaurant: restaurant })，但可透過ES6的物件擴展(object literal extension)縮寫成以下
  res.render('show', { restaurant })
})

// 搜尋頁面路由設定
app.get('/search', (req, res) => {

  const keyword = req.query.keyword
  const restaurants = restaurantList.results.filter(restaurant => {
    // 透過replace把字串中的空白格消除，透過toLowerCase把字母都變成小寫
    // 若keyword包含在name裡面就回傳true，若keyword包含在category裡面就回傳true，這樣搜尋欄位會同時搜尋「餐廳名稱」和「餐廳類別」
    if (restaurant.name.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
      return true
    } else if (restaurant.category.toLowerCase().replace(/ /g, '').includes(keyword.toLowerCase().replace(/ /g, ''))) {
      return true
    }

  })
  // 完整寫法是res.render('index', { restaurants: restaurants, keyword: keyword })，但可透過ES6的物件擴展(object literal extension)縮寫成以下
  res.render('index', { restaurants, keyword })
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})