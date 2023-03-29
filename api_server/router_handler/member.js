const db = require('../db/index')

exports.member = (req, res) => {
  const sql = 'select * from members'
  db.query(sql, function (err, results) {
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 0,
      message: '会员查询完成',
      data: results,
    })
  })
}

exports.memberAdd = (req, res) => {
  const userInfo = req.body
  const sql = 'select * from members where memberPhone = ?'
  db.query(sql, [userInfo.memberPhone], function (err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 0) {
      return res.cc('该电话号码已注册！')
    }
    const sqlAdd = 'insert into members set ?'
    db.query(sqlAdd, {memberName: userInfo.memberName, memberPhone: userInfo.memberPhone, memberPassword: userInfo.memberPassword}, function (err, results) {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        return res.cc('添加失败，请稍后重试！')
      }
      res.send({
        status: 0,
        message: '添加成功！欢迎成为本店会员！'
      })
    })
  })

}

exports.memberSelect = (req, res) => {
  const userInfo = req.body
  const sql = 'select memberName from members where memberPhone = ?'
  db.query(sql, [userInfo.memberPhone], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.length !== 1) {
      return res.cc('查询失败，请稍后重试！')
    }
    res.send({
      status: 0,
      message: '该会员已注册',
      data: results[0]
    })
  })
}