const express = require('express')

const router = express.Router()

const userHandler = require('../router_handler/user')

const expressJoi = require('@escook/express-joi')

const { userAdd_schema, login_schema, userRevise_schema, userDel_schema, passwordRevise_schema } = require('../schema/user')

router.post('/login', expressJoi(login_schema), userHandler.login)
router.post('/userAdd', expressJoi(userAdd_schema), userHandler.userAdd)
router.get('/users', userHandler.user)
router.post('/userRevise', expressJoi(userRevise_schema), userHandler.userRevise)
router.delete('/userDel', expressJoi(userDel_schema), userHandler.userDel)
router.get('/getUserInfo', userHandler.getUserInfo)
router.get('/logout', userHandler.logout)
router.post('/passwordRevise', expressJoi(passwordRevise_schema), userHandler.logout)

module.exports = router