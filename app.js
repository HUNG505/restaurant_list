// 載入express和
const express = require('express')
// 載入mongoose
const mongoose = require('mongoose')
// 載入handlebars
const exphbs = require('express-handlebars')
// 載入Body-parser
const bodyParser = require('body-parser')
// 載入method-override
const methodOverride = require('method-override')

// 載入總路由器
const routes = require('./routes/index')
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
// 使用method-override
app.use(methodOverride('_method'))
// 將request導入路由器
app.use(routes)


// <---設定路由--->
// 檢查資料快連線狀態，連線異常
db.on('error', () => {
  console.log('mongoDB error!')
})
// 檢查資料快連線狀態，連線正常
db.once('open', () => {
  console.log('mongoDB connected!')
})


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})