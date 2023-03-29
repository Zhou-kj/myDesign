const db = require('../db/index')

const jwt = require('jsonwebtoken')
const config = require('../config')

const moment = require('moment')

exports.goods = (req, res) => {
  const urlObj = req.query
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const sql = 'select * from goods where goodsBelong = ? and if(? != "", goodsName like concat("%", ?, "%"), 1=1) and if(? != "", goodsQuantity = ?, 1=1) and if(? != "", goodsSize = ?, 1=1) and if(? != "", goodsPrice between ? and ?, 1=1) and if(? != "", goodsNumber = ?, 1=1)'
  db.query(sql, [requestor.userBelong, urlObj.goodsName, urlObj.goodsName, urlObj.goodsQuantity, urlObj.goodsQuantity, urlObj.goodsSize, urlObj.goodsSize, urlObj.goodsMinPrice, urlObj.goodsMinPrice, urlObj.goodsMaxPrice, urlObj.goodsNumber, urlObj.goodsNumber, ], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 0,
      message: '查找完成',
      data: results
    })
  })
}

exports.goodsDiscount = (req, res) => {
  const goodsInfo = req.body
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const sql = 'update goods set goodsPrice = ? where goodsNumber = ? and goodsBelong = ?'
  db.query(sql, [goodsInfo.goodsPrice, goodsInfo.goodsNumber, requestor.userBelong], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 0,
      message: '该商品已打折',
    })
  })
}

exports.goodsBusiness = (req, res) => {
  const businessInfo = req.body
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  if (businessInfo.memberPhone) {
    const sql = 'select * from members where memberPhone = ? '
    db.query(sql, [businessInfo.memberPhone], function(err, results1) {
      if (err) {
        return res.cc(err)
      }
      if (results1.memberPassword != businessInfo.memberPassword) {
        return res.cc('密码错误，请重试！')
      }
      const sqlClothing = 'select * from goods where goodsNumber = ? and goodsSize = ? and goodsBelong = ?'
      db.query(sqlClothing, [businessInfo.goodsNumber, businessInfo.goodsSize, requestor.userBelong], function(err, results2) {
        if (err) {
          return res.cc(err)
        }
        if (results2.goodsQuantity == 0 || results2.goodsQuantity < businessInfo.goodsQuantity) {
          return res.cc('抱歉，该尺寸商品数量不足！')
        }
        const sqlDel = 'update goods set goodsQuantity = ? where goodsNumber = ? and goodsSize = ? and goodsBelong = ?'
        const quantity = businessInfo.goodsQuantity - businessInfo.goodsQuantity
        db.query(sqlDel, [quantity, businessInfo.goodsNumber, businessInfo.goodsSize, requestor.userBelong], function(err, results3) {
          if (err) {
            return res.cc(err)
          }
          if (results3.affectedRows !== 1) {
            return res.cc('交易过程出错，请重试！')
          }
          const originalCost = businessInfo.goodsQuantity * results2.goodsPrice
          const price = originalCost * 0.9
          const date = new Date()
          res.send({
            status: 0,
            message: '交易信息',
            data: {
              ...results2,
              goodsQuantity: businessInfo.goodsQuantity,
              goodsPrice: price,
              originalCost: originalCost,
              businessTime: moment(date).format('MMMM Do YYYY, h:mm:ss a')
            }
          })
        })
      })
    })
  } else {
    const sqlClothing = 'select * from goods where goodsNumber = ? and goodsSize = ? and goodsBelong = ?'
    db.query(sqlClothing, [businessInfo.goodsNumber, businessInfo.goodsSize, requestor.userBelong], function(err, results2) {
      if (err) {
        return res.cc(err)
      }
      if (results2.goodsQuantity == 0 || results2.goodsQuantity < businessInfo.goodsQuantity) {
        return res.cc('抱歉，该尺寸商品数量不足！')
      }
      const sqlUpdate = 'update goods set goodsQuantity = ? where goodsNumber = ? and goodsSize = ? and goodsBelong = ?'
      const quantity = businessInfo.goodsQuantity - businessInfo.goodsQuantity
      db.query(sqlUpdate, [quantity, businessInfo.goodsNumber, businessInfo.goodsSize, requestor.userBelong], function(err, results3) {
        if (err) {
          return res.cc(err)
        }
        if (results3.affectedRows !== 1) {
          return res.cc('交易过程出错，请重试！')
        }
        const originalCost = businessInfo.goodsQuantity * results2.goodsPrice
        const price = originalCost
        const date = new Date()
        res.send({
          status: 0,
          message: '交易信息',
          data: {
            ...results2,
            goodsQuantity: businessInfo.goodsQuantity,
            goodsPrice: price,
            originalCost: originalCost,
            businessTime: moment(date).format('MMMM Do YYYY, h:mm:ss a')
          }
        })
      })
    })
  }
}
