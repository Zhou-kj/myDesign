const joi = require('joi')

const memberName = joi.string().min(1).max(10).required().error(new Error('姓名无效'))
const memberPassword = joi.string().min(1).max(10).required().error(new Error('密码无效'))
const memberPhone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/).error(new Error('电话号码无效'))
const memberIDNumber = joi.string().pattern(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).error(new Error('身份证号无效'))
const memberSex = joi.string().required().error(new Error('性别无效'))
const memberID = joi.string().required().error(new Error('会员ID无效'))

exports.memberAdd_schema = {
  body: {
    memberName,
    memberPhone,
    memberPassword,
    memberIDNumber,
    memberSex,
  }
}

exports.memberSelect_schema = {
  body: {
    memberPhone,
    memberPassword,
  }
}

exports.memberRevise_schema = {
  body: {
    memberID,
    memberName,
    memberPhone,
    memberPassword,
    memberIDNumber,
    memberSex,
  }
}

exports.memberDel_schema = {
  memberID,
}

exports.memberVerify_schema = {
  memberPassword,
  memberPhone,
}