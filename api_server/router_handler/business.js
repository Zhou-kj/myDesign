const db = require('../db/index')

const jwt = require('jsonwebtoken')
const config = require('../config')

exports.businessConfirmation = (req, res) => {
  const businessInfo = req.body
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const sql = 'insert into business set ?'
  db.query(sql, { businessName: businessInfo.goodsName, businessSize: businessInfo.goodsSize, businessQuantity: businessInfo.goodsQuantity, businessPrice: businessInfo.goodsPrice, businessOriginalCost: businessInfo.originalCost, businessTime: businessInfo.businessTime, businessBelong: requestor.userBelong }, function (err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('交易确认过程出错，请重试！')
    }
    res.cc({
      status: 0,
      message: '交易成功！',
    })
  })
}

exports.business = (req, res) => {
  const businessInfo = req.body
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const belong = requestor.userBelong ? requestor.userBelong : businessInfo.businessBelong
  const sql = 'select * from business where businessBelong = ?'
  db.query(sql, [belong], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 0,
      message: '过往交易信息',
      data: results
    })
  })
}