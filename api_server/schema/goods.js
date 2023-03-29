const joi = require('joi')

const goodsPrice = joi.string().pattern(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/)
const goodsNumber = joi.string().pattern(/^\d{n}$/)
const goodsName = joi.string()
const goodsQuantity = joi.string().pattern(/^[0-9]*$/)
const goodsSize = joi.string()
const memberPhone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)
const memberPassword = joi.string().min(1).max(10).required()

exports.goodsDiscount_schema = {
  body: {
    goodsPrice,
    goodsNumber
  }
}

exports.goods_schema = {
  query: {
    goodsMinPrice: goodsPrice,
    goodsMaxPrice: goodsPrice,
    goodsNumber,
    goodsName,
    goodsQuantity,
    goodsSize
  }
}

exports.goodsBusiness_schema = {
  body: {
    memberPhone,
    memberPassword,
    goodsSize,
    goodsNumber,
    goodsQuantity,
  }
}