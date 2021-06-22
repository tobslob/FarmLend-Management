import Joi from '@hapi/joi'
import { JoiValidator } from '@app/data/util'

export const isID = Joi.object({
  id: JoiValidator.validateID(),
})
