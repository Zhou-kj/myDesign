const express = require('express')

const router = express.Router()

const shopsHandler = require('../router_handler/shops')

const expressJoi = require('@escook/express-joi')

const { shopsAdd_schema, shopsRevise_schema, shopsDel_schema } = require('../schema/shops')

router.get('/shops', shopsHandler.shops)
router.put('/shopsAdd', expressJoi(shopsAdd_schema), shopsHandler.shopsAdd)
router.post('/shopsRevise', expressJoi(shopsRevise_schema), shopsHandler.shopsRevise)
router.post('/shopsDel', expressJoi(shopsDel_schema), shopsHandler.shopsDel)

module.exports = router