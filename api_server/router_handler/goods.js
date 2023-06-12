const db = require('../db/index')

const jwt = require('jsonwebtoken')
const config = require('../config')
const xlsx = require('node-xlsx')

const moment = require('moment')

exports.goods = (req, res) => {
  const urlObj = req.query
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const sql = 'select * from goods where goodsBelong = ? and goodsQuantity != 0 and if(? != "", goodsName like concat("%", ?, "%"), 1=1) and if(? != "", goodsQuantity = ?, 1=1) and if(? != "", goodsSize = ?, 1=1) and if(? != "", goodsPrice between ? and ?, 1=1) and if(? != "", goodsNumber = ?, 1=1)'
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

exports.import = (req, res) => {
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const sheet = xlsx.parse(req.file.path)
  let flag = false
  sheet[0].data.forEach(row => {
    if(row[0] != '服装名称') {
      if(['男装', '女装', '童装'].indexOf(row[1]) == -1 || typeof row[2] != 'number' || ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].indexOf(row[3]) == -1 || !(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(row[4])) || !(/^[0-9]{1,8}$/.test(row[5]))) {
        flag = true
      }
    }
  })
  if(flag) {
    return res.cc('表格数据存在错误，请检查后重试！')
  }
  sheet[0].data.forEach(row => {
    console.log(row,'////');
    const sql = 'select * from goods where goodsNumber = ?'
    if(row[0] != '服装名称') {
      db.query(sql, [row[5]], function(err, result) {
        if (err) {
          return res.cc('导入出现错误，请重试！')
        }
        if (result.length > 0) {
          const sql1 = 'update goods set goodsQuantity = ? where goodsNumber = ?'
          let quantity = row[2]+result[0].goodsQuantity
          db.query(sql1, [quantity, row[5]], function(err1, result1) {
            if (err1) {
              return res.cc('更新数据时出现错误，请重试！')
            }
          })
        } else {
          console.log('.....');
          const sql2 = 'insert into goods set ?'
          db.query(sql2, {goodsName: row[0], goodsType: row[1], goodsQuantity: row[2], goodsSize: row[3], goodsPrice: row[4], goodsNumber: row[5], goodsBelong: requestor.userBelong}, function(err2, result2) {
            if (err2) {
              return res.cc('插入数据时出错，请重试！')
            }
          })
        }
      })
    }
  })
  res.send({
    status: 0,
    message: '导入完成'
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

exports.goodsRevise = (req, res) => {
  const goodsInfo = req.body
  const sql = 'update goods set goodsName = ?, goodsType = ?, goodsQuantity = ?, goodsSize = ?, goodsPrice = ?, goodsNumber = ? where goodsID = ?'
  db.query(sql, [goodsInfo.goodsName, goodsInfo.goodsType, goodsInfo.goodsQuantity, goodsInfo.goodsSize, goodsInfo.goodsPrice, goodsInfo.goodsNumber, goodsInfo.goodsID], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('修改失败，请重试！')
    }
    res.send({
      status: 0,
      message: '修改成功',
    })
  })
}

exports.goodsBusiness = (req, res) => {
  const businessInfo = req.body
  const business = businessInfo.goodsInfo
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const date = Date.now()
  if (businessInfo.memberPhone) {
    const sqlUpdate = 'update goods set goodsQuantity = ? where goodsNumber = ? and goodsBelong = ?'
    const sqlBusiness = 'insert into business set ?'
    const businessTime = moment(date).format('YYYY-MM-DD HH:mm:ss')
    business.forEach(element => {
      const quantity = element.goodsQuantity - element.num
      db.query(sqlUpdate, [quantity, element.goodsNumber, requestor.userBelong], function(err, results1) {
        if (err) {
          return res.cc(err)
        }
        if (results1.affectedRows !== 1) {
          return res.cc('交易过程出错，请重试！')
        }
        db.query(sqlBusiness, {businessName: element.goodsName, businessNumber: element.goodsNumber, businessSize: element.goodsSize, businessQuantity: element.num, businessPrice: element.goodsPrice * element.discount, businessOriginalPrice: element.goodsPrice, businessTime: businessTime, businessBelong: requestor.userBelong, memberPhone: businessInfo.memberPhone, businessType: element.goodsType}, function(err, results2) {
          if (err) {
            return res.cc(err)
          }
        })
      })
    })
  } else {
    const sqlUpdate = 'update goods set goodsQuantity = ? where goodsNumber = ? and goodsBelong = ?'
    const sqlBusiness = 'insert into business set ?'
    const businessTime = moment(date).format('YYYY-MM-DD HH:mm:ss')
    business.forEach(element => {
      const quantity = element.goodsQuantity - element.num
      db.query(sqlUpdate, [quantity, element.goodsNumber, requestor.userBelong], function(err, results1) {
        if (err) {
          console.log(err);
          return res.cc(err)
        }
        if (results1.affectedRows !== 1) {
          return res.cc('交易过程出错，请重试！')
        }
        db.query(sqlBusiness, {businessName: element.goodsName, businessNumber: element.goodsNumber, businessSize: element.goodsSize, businessQuantity: element.num, businessPrice: element.goodsPrice * element.discount, businessOriginalPrice: element.goodsPrice, businessTime: businessTime, businessBelong: requestor.userBelong, memberPhone: businessInfo.memberPhone, businessType: element.goodsType}, function(err, results2) {
          if (err) {
            return res.cc(err)
          }
        })
      })
    })
  }
  res.send({
    status: 0,
    message: '交易成功！',
  })
}
