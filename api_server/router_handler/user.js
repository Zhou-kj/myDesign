const db = require('../db/index')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')
const config = require('../config')

exports.getUserInfo = (req, res) => {
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  res.send({
    status: 0,
    message: '获取用户信息',
    data: {
      ...requestor
    }
  })
}

exports.passwordRevise = (req, res) => {
  const requestor = jwt.verify(req.headers.authorization.replace('Bearer ', ''), config.jwtSecretKey)
  const password = req.body
  const sql = 'select * from users where userPhone = ?'
  db.query(sql, [requestor.userPhone], (err, results) => {
    if (err) {
      res.cc(err)
    }
    const compareResult = bcrypt.compareSync(password.oldPassword, results[0].userPassword)
    if (!compareResult) {
      return res.cc('原密码错误，请重试!')
    }
    const sqlPassword = 'update users set userPassword = ? where userPhone = ?'
    db.query(sqlPassword, [password.newPassword, requestor.userPhone], function(err, results) {
      if (err) {
        res.cc(err)
      }
      if (results.affectedRows !== 1) {
        res.cc('修改失败，请重试！')
      }
      res.send({
        status: 0,
        message: '修改成功！',
      })
    })
  })
}

exports.userAdd = (req, res) => {
  const userInfo = req.body
  console.log(userInfo);
  const requestor = req.headers.authorization.replace('Bearer ', '')
  const role = '1'

  jwt.verify(requestor, config.jwtSecretKey, function (err, data) {
    const belong = data.userBelong
    const sql = 'select * from users where userPhone = ?'
    db.query(sql, [userInfo.userPhone], function(err, results) {
      if (err) {
        return res.send(err)
      }
      if (results.length > 0) {
        return res.cc('电该号码被占用，请更换号码！')
      }
      userInfo.userPassword = bcrypt.hashSync(userInfo.userPassword, 10)
      const sqlAdd = 'insert into users set ?'
      db.query(sqlAdd, { userName: userInfo.userName, userSex: userInfo.userSex, userPassword: userInfo.userPassword, userAge: userInfo.userAge, userPhone: userInfo.userPhone, userIDNumber: userInfo.userIDNumber, userBelong: belong, userRole: role }, function(err, results) {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.cc('添加店员失败，请稍后再试！')
        }
        res.send( { status: 0, message: '添加成功！'})
      })
    })
  })
}

exports.user = (req, res) => {
  const requestor = req.headers.authorization.replace('Bearer ', '')
  jwt.verify(requestor, config.jwtSecretKey, function(err, data) {
    const sql = 'select userID, userName, userSex, userAge, userPhone, userIDNumber, userBelong from users where userBelong = ? and userRole != 2'
    console.log(data);
    db.query(sql, [data.userBelong], function(err, results) {
      if (err) {
        return res.cc(err)
      }
      res.send( {
        status: 0,
        message: '查询员工完成',
        data: results
      } )
    })
  })
}

exports.userRevise = (req, res) => {
  const userInfo = req.body
  userInfo.userPassword = bcrypt.hashSync(userInfo.userPassword, 10)
  const sql = 'update users set userName = ?, userSex = ?, userAge = ?, userPhone = ?, userIDNumber = ?, userPassword = ? where userID = ?'
  db.query(sql, [userInfo.userName, userInfo.userSex, userInfo.userAge, userInfo.userPhone, userInfo.userIDNumber, userInfo.userPassword, userInfo.userID], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('修改失败，请重试！')
    }
    res.send({status: 0, message: '修改成功！'})
  })
}

exports.userDel = (req, res) => {
  const userInfo = req.body
  console.log(userInfo);
  const sql = 'delete from users where userPhone = ?'
  db.query(sql, [userInfo.userPhone], function (err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('删除失败，请重试！')
    }
    res.send({
      status: 0,
      message: '删除成功！',
    })
  })
}

exports.login = (req, res) => {
  console.log(req.body)
  const userInfo = req.body

  const sql = 'select * from users where userPhone = ?'
  db.query(sql, [userInfo.userPhone], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('登录失败，电话号码错误！')
    }
    const compareResult = bcrypt.compareSync(userInfo.userPassword, results[0].userPassword)
    if (!compareResult) {
      return res.cc('登录失败！密码错误')
    }
    const user = { ...results[0], userPassword: '', }
    console.log(user);
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: '12h',
    })

    res.send({
      status: 0,
      message: '登录成功！',
      token: 'Bearer ' + tokenStr,
    })
  })
}

exports.logout = (req, res) => {
  res.send({
      status: 0,
      message: '注销成功！'
  })
}