const express = require('express')

const router = express.Router()

const businessHandler = require('../router_handler/business')

router.get('/business', businessHandler.business)
router.post('/businessConfirmation', businessHandler.businessConfirmation)

module.exports = router