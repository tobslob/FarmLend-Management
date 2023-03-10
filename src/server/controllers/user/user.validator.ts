import { OrganizationType } from "@app/data/models";
import { JoiValidator } from "@app/data/util";
import Joi from "@hapi/joi";
import { values } from "lodash";

export const isUser = Joi.object({
  firstName: JoiValidator.validateString().required(),
  lastName: JoiValidator.validateString().required(),
  emailAddress: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required(),
  organizationId: JoiValidator.validateID().default(null),
  organizationName: Joi.when("organizationId", {
    is: null,
    then: JoiValidator.validateString().required(),
    otherwise: JoiValidator.validateString()
  }),
  organizationType: Joi.when("organizationId", {
    is: null,
    then: JoiValidator.validateString().valid(values(OrganizationType)).required(),
    otherwise: JoiValidator.validateString().valid(values(OrganizationType))
  }),
});

export const isLogin = Joi.object({
  emailAddress: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required()
});

export const isID = Joi.object({
  id: JoiValidator.validateID().required()
});
