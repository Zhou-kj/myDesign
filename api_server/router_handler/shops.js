const db = require('../db/index')
const bcrypt = require('bcryptjs')

exports.shopsAdd = (req, res) => {
  const shopsInfo = req.body
  const sql1 = 'select * from shops where shopIDNumber = ?'
  db.query(sql1, [shopsInfo.shopIDNumber], function(err, results) {
    if (err) {
      return res.send(err)
    }
    if (results.length > 0) {
      return res.cc('店铺编号重复，请重新填写！')
    }
    const sql2 = 'select * from shops where shopShopOwnerPhone = ?'
    db.query(sql2, [shopsInfo.shopShopOwnerPhone], function(err, results) {
      if (err) {
        return res.send(err)
      }
      if (results.length > 0) {
        return res.cc('该电话号码已被占用，请重新填写！')
      }
      const sql = 'insert into shops set ?'
      db.query(sql, {shopShopOwnerName: shopsInfo.shopShopOwnerName, shopShopOwnerSex: shopsInfo.shopShopOwnerSex, shopShopOwnerPassword: shopsInfo.shopShopOwnerPassword, shopShopOwnerPhone: shopsInfo.shopShopOwnerPhone, shopShopOwnerAge: shopsInfo.shopShopOwnerAge, shopShopOwnerID: shopsInfo.shopShopOwnerID, shopAddress: shopsInfo.shopAddress, shopIDNumber: shopsInfo.shopIDNumber}, function (err, results) {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.cc('新增失败，请重试！')
        }

        const role = '2'

        // const sql = 'select * from users where userPhone = ?'
        // userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        const sqlAdd = 'insert into users set ?'
        shopsInfo.shopShopOwnerPassword = bcrypt.hashSync(shopsInfo.shopShopOwnerPassword, 10)
        db.query(sqlAdd, { userName: shopsInfo.shopShopOwnerName, userSex: shopsInfo.shopShopOwnerSex, userPassword: shopsInfo.shopShopOwnerPassword, userAge: shopsInfo.shopShopOwnerAge, userPhone: shopsInfo.shopShopOwnerPhone, userIDNumber: shopsInfo.shopShopOwnerID, userBelong: shopsInfo.shopIDNumber, userRole: role }, function(err, results) {
          if (err) {
            return res.cc(err)
          }
          if (results.affectedRows !== 1) {
            return res.cc('添加店铺失败，请稍后再试！')
          }
          res.send( { status: 0, message: '添加成功！'})
        })
      })
    })
  })
}

exports.shopsRevise = (req, res) => {
  console.log(req.body)
  const shopsInfo = req.body
  const sql = 'update shops set shopShopOwnerName = ?, shopShopOwnerPhone = ?, shopShopOwnerAge = ?, shopShopOwnerID = ?, shopAddress = ?, shopShopOwnerPassword = ?where shopIDNumber = ?'
  db.query(sql, [shopsInfo.shopShopOwnerName, shopsInfo.shopShopOwnerPhone, shopsInfo.shopShopOwnerAge, shopsInfo.shopShopOwnerID, shopsInfo.shopAddress, shopsInfo.shopShopOwnerPassword, shopsInfo.shopIDNumber], function (err, results) {
    if (err) {
      return res.cc(err)
    }
    console.log(results.affectedRows)
    if (results.affectedRows !== 1) {
      return res.cc('店铺信息修改失败，请重试！')
    }
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
    res.send({
      status: 0,
      message: '店铺信息修改成功！'
    })
  })
}

exports.shopsDel = (req, res) => {
  const shopsInfo = req.body
  console.log(req.body)
  const sql = 'select * from users where userBelong = ?'
  db.query(sql, [shopsInfo.shopIDNumber], function(err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.length > 1) {
      return res.cc('删除失败，该店铺下还有员工')
    }
    const sqlDel = 'delete from shops where shopIDNumber = ?'
    db.query(sqlDel, [shopsInfo.shopIDNumber], function(err, results) {
      if (err) {
        return res.cc(err)
      }
      if (results.affectedRows !== 1) {
        return res.cc('删除失败，请重试！')
      }
      const sqlDelUser = 'delete from users where userPhone = ?'
      db.query(sqlDelUser, [shopsInfo.shopShopOwnerPhone], function(err, results) {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.cc('删除失败，请重试！')
        }
        res.send({
          status: 0,
          message: '删除成功！'
        })
      })
    })
  })
}

exports.shops = (req, res) => {
  const sql = 'select shopID, shopAddress, shopIDNumber, shopShopOwnerName, shopShopOwnerSex, shopShopOwnerPhone, shopShopOwnerAge, shopShopOwnerID from shops'
  db.query(sql, function(err, results) {
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 0,
      message: '店铺信息',
      data: results,
    })
  })
}