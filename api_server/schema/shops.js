const joi = require('joi')

const shopShopOwnerName = joi.string()
const shopShopOwnerSex = joi.string()
const shopShopOwnerPhone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)
const shopShopOwnerAge = joi.string()
const shopShopOwnerAddress = joi.string()
const shopShopOwnerID = joi.string().pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)
const shopIDNumber = joi.string().pattern(/^[\S]{4}$/)
const belong = joi.string().pattern(/^[\S]{4}$/)

exports.shopsAdd_schema = {
  body: {
    shopShopOwnerName,
    shopShopOwnerPhone,
    shopShopOwnerAge,
    shopShopOwnerAddress,
    shopShopOwnerID,
    shopIDNumber,
    shopShopOwnerSex
  }
}

exports.shopsRevise_schema = {
  body: {
    shopShopOwnerName,
    shopShopOwnerPhone,
    shopShopOwnerAge,
    shopShopOwnerAddress,
    shopShopOwnerID,
    shopIDNumber,
    shopShopOwnerSex
  }
}

exports.shopsDel_schema = {
  body: {
    belong,
    shopIDNumber
  }
}