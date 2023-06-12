const express = require('express')

const router = express.Router()

const expressJoi = require('@escook/express-joi')

const businessHandler = require('../router_handler/business')
// const { businessDel_schema } = require('../schema/business')

router.get('/business', businessHandler.business)
router.post('/businessDel', businessHandler.businessDel)
router.post('/businessStatistics', businessHandler.businessStatistics)
router.post('/shopBusinessStatistics', businessHandler.shopBusinessStatistics)

module.exports = router