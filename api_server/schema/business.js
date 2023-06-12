const joi = require('joi')

const goodsPrice = joi.string().pattern(/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/).error(new Error('商品价格无效'))
const goodsNumber = joi.string().pattern(/^\d{n}$/).error(new Error('商品编号无效'))
const goodsName = joi.string().error(new Error('商品名称无效'))
const num = joi.string().pattern(/^[0-9]*$/).error(new Error('商品数量无效'))
const goodsSize = joi.string().error(new Error('商品尺寸无效'))
const goodsID = joi.string().error(new Error('商品ID无效'))
const discount = joi.string().error(new Error('商品折扣无效'))

// exports.businessConfirmation_schema = {
//   body: {
//     goodsPrice,
//     goodsNumber,
//     goodsName,
//     num,
//     goodsSize,
//     goodsID,
//     discount
//   }
// }