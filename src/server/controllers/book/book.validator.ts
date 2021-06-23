import Joi from '@hapi/joi'
import { JoiValidator } from '@app/data/util'

export const isBook = Joi.object({
  title: JoiValidator.validateString().required(),
  author: JoiValidator.validateString().required(),
  year: JoiValidator.validateString().required(),
  genre: JoiValidator.validateString().required(),
  tags: Joi.array().items(JoiValidator.validateString()).required(),
  publisher: JoiValidator.validateString().required(),
  released_date: Joi.date().required(),
  slug: JoiValidator.validateString().required(),
  description: JoiValidator.validateString().required(),
  price: JoiValidator.validateNumber().required(),
  available_copies: JoiValidator.validateNumber().required(),
})

// remain endpoint for likes and rating
