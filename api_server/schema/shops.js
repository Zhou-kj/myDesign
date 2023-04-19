const joi = require('joi')

const shopShopOwnerName = joi.string().error(new Error('姓名无效'))
const shopShopOwnerSex = joi.string().error(new Error('性别无效'))
const shopShopOwnerPhone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/).error(new Error('电话号码无效'))
const shopShopOwnerPassword = joi.string().error(new Error('密码无效'))
const shopShopOwnerAge = joi.string().pattern(/^(?:[2-4][0-9]|50)$/).error(new Error('年龄无效'))
const shopAddress = joi.string().error(new Error('地址无效'))
const shopShopOwnerID = joi.string().pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).error(new Error('身份证号码无效'))
const shopIDNumber = joi.string().pattern(/^[\S]{10}$/).error(new Error('店铺编号无效'))

exports.shopsAdd_schema = {
  body: {
    shopShopOwnerName,
    shopShopOwnerPhone,
    shopShopOwnerAge,
    shopAddress,
    shopShopOwnerID,
    shopIDNumber,
    shopShopOwnerSex,
    shopShopOwnerPassword
  }
}

exports.shopsRevise_schema = {
  body: {
    shopShopOwnerName,
    shopShopOwnerPhone,
    shopShopOwnerAge,
    shopAddress,
    shopShopOwnerID,
    shopIDNumber,
    shopShopOwnerSex,
    shopShopOwnerPassword
  }
}

exports.shopsDel_schema = {
  body: {
    shopShopOwnerPhone,
    shopIDNumber,
  }
}