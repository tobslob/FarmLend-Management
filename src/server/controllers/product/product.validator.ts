import { JoiValidator } from '@app/data/util';
import Joi from '@hapi/joi';

export const isProduct = Joi.object({
  category: JoiValidator.validateString().required(),
  variety: JoiValidator.validateString().required(),
  packaging: JoiValidator.validateString().required(),
  volume: JoiValidator.validateNumber().required(),
  pricePerUnit: JoiValidator.validateNumber().required(),
});
