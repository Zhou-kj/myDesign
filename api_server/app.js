const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const multer = require('multer')

const app = express()

const userRouter = require('./router/user')
const memberRouter = require('./router/member')
const goodsRouter = require('./router/goods')
const businessRouter = require('./router/business')
const shopsRouter = require('./router/shops')

const config = require('./config')

const expressJWT = require('express-jwt')

const joi = require('joi')

app.use(cors())

app.use(express.urlencoded({ extended: false}))

// 解析 application/json
app.use(bodyParser.json())
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// const upload = multer({dest: 'uploads/'})
// app.use(upload.single('file'))
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    filename = '服装进货表-'+Date.now()+'.xlsx'
    cb(null, filename)
  }
})
let upload = multer({storage})
app.use(upload.single('file'))

app.use(function(req, res, next) {
  res.cc = function (err, status = 1) {
    res.send( {
      status,
      message: err instanceof Error ? err.message : err,
    })
  }
  next()
})

app.use(expressJWT( { secret: config.jwtSecretKey} ).unless( { path: [/^\/csms\/user\/login/]} ))


app.use('/csms/user', userRouter)
app.use('/csms/member', memberRouter)
app.use('/csms/goods', goodsRouter)
app.use('/csms/business', businessRouter)
app.use('/csms/shops', shopsRouter)


app.use(function (err, req, res, next) {
  //数据验证失败
  if (err instanceof joi.ValidationError) {
    return res.cc(err)
  }
  if (err.name === 'UnauthorizedError') {
    return res.cc('身份认证失败！')
  }
  res.cc(err)
})

app.listen(3007, function() {
  console.log('api server running at http://127.0.0.1:3007')
})