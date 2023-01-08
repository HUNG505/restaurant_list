// 載入mongoose
const mongoose = require('mongoose')

// 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 取得資料庫的狀態
const db = mongoose.connection

// 檢查資料快連線狀態，連線異常
db.on('error', () => {
  console.log('mongoDB error!')
})
// 檢查資料快連線狀態，連線正常
db.once('open', () => {
  console.log('mongoDB connected!')
})

module.exports = db
