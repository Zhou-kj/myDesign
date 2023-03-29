const express = require('express')

const router = express.Router()

const goodsHandler = require('../router_handler/goods')

const expressJoi = require('@escook/express-joi')

const { goods_schema, goodsDiscount_schema, goodsBusiness_schema } = require('../schema/goods')


router.get('/goods', expressJoi(goods_schema), goodsHandler.goods)
router.post('/goodsDiscount', expressJoi(goodsDiscount_schema), goodsHandler.goodsDiscount)
router.post('/goodsBusiness', expressJoi(goodsBusiness_schema), goodsHandler.goodsBusiness)

module.exports = router