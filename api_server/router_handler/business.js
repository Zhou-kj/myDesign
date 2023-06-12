const db = require('../db/index')

const jwt = require('jsonwebtoken')
const config = require('../config')
const moment = require('moment')

exports.businessDel = (req, res) => {
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const data = req.body
  const endTime = moment(new Date(data.businessTime).getTime() + 2000).format('YYYY-MM-DD HH:mm:ss')
  console.log(data.businessTime, endTime);
  const sql = 'delete from business where businessNumber = ? and businessTime between ? and ? and businessBelong = ?'
  db.query(sql, [data.businessNumber, data.businessTime, endTime, requestor.userBelong], function(err, results) {
    if (err) {
      console.log(err);
      return res.cc('退货出现问题，请重试！')
    }
    const sqlBusiness = 'update goods set goodsQuantity = goodsQuantity+?  where goodsNumber = ? and goodsBelong = ?'
    db.query(sqlBusiness, [data.businessQuantity, data.businessNumber, requestor.userBelong], function(err, results) {
      if (err) {
        return res.cc('退货商品出现问题，请联系维护人员！')
      }
      res.send({
        status: 0,
        message: '退货完成',
      })
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
    results.forEach(element => {
      element.businessTime = moment(new Date(element.businessTime).getTime() - 1).format('YYYY-MM-DD HH:mm:ss')
    });
    res.send({
      status: 0,
      message: '过往交易信息',
      data: results
    })
  })
}

exports.businessStatistics = (req, res) => {
  const data = req.body
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const sql = 'select * from business where businessBelong = ? and businessTime between ? and ?'
  db.query(sql, [requestor.userBelong, data.startTime, data.endTime], function(err, results) {
    if (err) {
      return res.cc('交易查询出错，请重试！')
    }
    console.log(data);
    res.send({
      status: 0,
      message: '交易查询完成',
      data: results
    })
  })
}

exports.shopBusinessStatistics = (req, res) => {
  const data = req.body
  const sql = 'select * from business where businessBelong = ? and businessTime between ? and ?'
  db.query(sql, [data.shopIDNumber, data.startTime, data.endTime], function(err, results) {
    if (err) {
      return res.cc('交易查询出错，请重试！')
    }
    console.log(data);
    res.send({
      status: 0,
      message: '交易查询完成',
      data: results
    })
  })
}