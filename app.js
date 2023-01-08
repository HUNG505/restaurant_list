// 載入express和
const express = require('express')
// 載入handlebars
const exphbs = require('express-handlebars')
// 載入Body-parser
const bodyParser = require('body-parser')
// 載入method-override
const methodOverride = require('method-override')
// 載入mongoose
require('./config/mongoose')

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

// 設定靜態檔案的位置
app.use(express.static('public'))
// 使用body-parser
app.use(bodyParser.urlencoded({ extended: true }))
// 使用method-override
app.use(methodOverride('_method'))

// 將request導入路由器
app.use(routes)

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})