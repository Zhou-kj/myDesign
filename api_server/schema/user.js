const joi = require('joi')

const userSex = joi.string().required().error(new Error('性别无效'))
const userName = joi.string().required().error(new Error('用户名无效'))
const userPassword = joi.string().required().error(new Error('密码无效'))
const belong = joi.string().pattern(/^[\S]{4}$/).error(new Error('所属店铺编号无效'))
const userAge = joi.string().error(new Error('年龄无效'))
const userPhone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/).required().error(new Error('电话号码无效'))
const userIDNumber = joi.string().pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).error(new Error('身份证号无效'))
const oldPassword = joi.string().required().error(new Error('原密码无效'))
const newPassword = joi.string().required().error(new Error('新密码无效'))

exports.passwordRevise_schema = {
  body: {
    oldPassword,
    newPassword,
  }
}

exports.userAdd_schema = {
  body: {
    userName,
    userPassword,
    belong,
    userAge,
    userPhone,
    userIDNumber,
    userSex
  }
}

exports.userRevise_schema = {
  body: {
    userName,
    userPassword,
    userAge,
    userPhone,
    userIDNumber,
    userSex
  }
}

exports.userDel_schema = {
  body: {
    userPhone,
  }
}

exports.login_schema = {
  body: {
    userPassword,
    userPhone,
  }
}