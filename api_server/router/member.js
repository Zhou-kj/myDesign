const express = require('express')

const router = express.Router()

const memberHandler = require('../router_handler/member')

const expressJoi = require('@escook/express-joi')

const { memberAdd_schema, memberSelect_schema, } = require('../schema/member')

router.get('/members', memberHandler.member)
router.post('/memberAdd', expressJoi(memberAdd_schema), memberHandler.memberAdd)
router.post('/memberSelect', expressJoi(memberSelect_schema), memberHandler.memberSelect)

module.exports = router