import { OrganizationType } from "@app/data/models";
import { JoiValidator } from "@app/data/util";
import Joi from "@hapi/joi";
import { values } from "lodash";

export const isOrganization = Joi.object({
  name: JoiValidator.validateString().required(),
  type: JoiValidator.validateString().valid(values(OrganizationType)).required(),
  products: JoiValidator.validateArray(),
  orders: JoiValidator.validateArray()
});

export const isOrganizationUpdate = Joi.object({
  name: JoiValidator.validateString(),
  type: JoiValidator.validateString().valid(values(OrganizationType)),
})
