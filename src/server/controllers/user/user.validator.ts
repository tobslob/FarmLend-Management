import Joi from '@hapi/joi'
import { JoiValidator } from '@app/data/util'

export const isUser = Joi.object({
  first_name: JoiValidator.validateString().required(),
  last_name: JoiValidator.validateString().required(),
  email_address: JoiValidator.validateEmail().required(),
  location: JoiValidator.validateString().required(),
  password: JoiValidator.validatePassword().required()
})

export const isLogin = Joi.object({
  email_address: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required()
})
