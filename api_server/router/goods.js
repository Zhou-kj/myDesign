const express = require('express')

const router = express.Router()

const goodsHandler = require('../router_handler/goods')

const expressJoi = require('@escook/express-joi')

const { goodsDiscount_schema, goodsRevise_schema } = require('../schema/goods')


router.get('/goods', goodsHandler.goods)
router.post('/goodsDiscount', expressJoi(goodsDiscount_schema), goodsHandler.goodsDiscount)
router.post('/goodsBusiness', goodsHandler.goodsBusiness)
router.post('/goodsRevise', expressJoi(goodsRevise_schema), goodsHandler.goodsRevise)
router.post('/import', goodsHandler.import)

module.exports = router