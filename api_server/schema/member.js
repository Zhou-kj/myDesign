const joi = require('joi')

const memberName = joi.string().min(1).max(10).required()
const memberPassword = joi.string().min(1).max(10).required()
const memberPhone = joi.string().pattern(/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/)

exports.memberAdd_schema = {
  body: {
    memberName,
    memberPhone,
    memberPassword,
  }
}

exports.memberSelect_schema = {
  body: {
    memberPhone,
    memberPassword,
  }
}

