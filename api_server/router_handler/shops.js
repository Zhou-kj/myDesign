const db = require('../db/index')

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
    const sql2 = 'select * from users where shopShopOwnerPhone = ?'
    db.query(sql2, [shopsInfo.shopShopOwnerPhone], function(err, results) {
      if (err) {
        return res.send(err)
      }
      if (results.length > 0) {
        return res.cc('该电话号码已被占用，请重新填写！')
      }
      const sql = 'inset into shops set ?'
      db.query(sql, {shopShopOwnerName: shopsInfo.shopShopOwnerName, shopShopOwnerSex: shopsInfo.shopShopOwnerSex, shopShopOwnerFace: shopsInfo.shopShopOwnerFace, shopShopOwnerPhone: shopsInfo.shopShopOwnerPhone, shopShopOwnerAge: shopsInfo.shopShopOwnerAge, shopShopOwnerID: shopsInfo.shopShopOwnerID, shopShopOwnerAddress: shopsInfo.shopShopOwnerAddress, shopIDNumber: shopsInfo.shopIDNumber}, function (err, results) {
        if (err) {
          return res.cc(err)
        }
        if (results.affectedRows !== 1) {
          return res.cc('新增失败，请重试！')
        }

        const role = '2'

        const sql = 'select * from users where userPhone = ?'
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)

        const sqlAdd = 'insert into users set ?'
        db.query(sqlAdd, { userName: shopsInfo.shopShopOwnerName, userSex: shopsInfo.shopShopOwnerSex, userFace: '', userPassword: shopsInfo.shopShopOwnerPassword, userAge: shopsInfo.shopShopOwnerAge, userPhone: shopsInfo.shopShopOwnerPhone, userIDNumber: shopsInfo.shopShopOwnerID, userBelong: shopsInfo.shopShopIDNumber, userRole: role }, function(err, results) {
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
  })
}

exports.shopsRevise = (req, res) => {
  const shopsInfo = req.body
  const sql = 'update shops set shopShopOwnerName = ?, shopShopOwnerPhone = ?, shopShopOwnerAge = ?, shopShopOwnerID = ?, shopShopOwnerAddress = ?, shopIDNumber = ?'
  db.query(sql, [shopsInfo.shopShopOwnerName, shopsInfo.shopShopOwnerPhone, shopsInfo.shopShopOwnerAge, shopsInfo.shopShopOwnerID, shopsInfo.shopShopOwnerAddress, shopsInfo.shopIDNumber], function (err, results) {
    if (err) {
      return res.cc(err)
    }
    if (results.affectedRows !== 1) {
      return res.cc('店铺信息修改失败，请重试！')
    }
    res.send({
      status: 0,
      message: '店铺信息修改成功！'
    })
  })
}

exports.shopsDel = (req, res) => {
  const shopsInfo = req.body
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
      res.send({
        status: 0,
        message: '删除成功！'
      })
    })
  })
}

exports.shops = (req, res) => {
  const sql = 'select shopID, shopAddress, shopsIDNumber, shopShopOwnerName, shopShopOwnerFace, shopShopOwnerSex, shopShopOwnerPhone, shopShopOwnerAge, shopShopOwnerID from shops'
  db.query(sql, function(err, results) {
    if (err) {
      return res.cc(err)
    }
    res.send({
      status: 0,
      message: '店铺信息',
    })
  })
}