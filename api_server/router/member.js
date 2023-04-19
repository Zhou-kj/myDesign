const express = require('express')

const router = express.Router()

const memberHandler = require('../router_handler/member')

const expressJoi = require('@escook/express-joi')

const { memberAdd_schema, memberSelect_schema, memberRevise_schema, memberDel_schema } = require('../schema/member')

router.get('/members', memberHandler.member)
router.put('/memberAdd', expressJoi(memberAdd_schema), memberHandler.memberAdd)
router.post('/memberSelect', expressJoi(memberSelect_schema), memberHandler.memberSelect)
router.post('/memberRevise', expressJoi(memberRevise_schema), memberHandler.memberRevise)
router.post('/memberDel', expressJoi(memberDel_schema), memberHandler.memberDel)

module.exports = router