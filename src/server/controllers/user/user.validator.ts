import { OrganizationType } from "@app/data/models";
import { JoiValidator } from "@app/data/util";
import Joi from "@hapi/joi";
import { values } from "lodash";

export const isUser = Joi.object({
  firstName: JoiValidator.validateString().required(),
  lastName: JoiValidator.validateString().required(),
  emailAddress: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required(),
  organizationId: JoiValidator.validateID(),
  organizationName: JoiValidator.validateString().when("organizationId", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  organizationType: JoiValidator.validateString()
    .valid(values(OrganizationType))
    .when("organizationId", {
      is: false,
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
});

export const isLogin = Joi.object({
  emailAddress: JoiValidator.validateEmail().required(),
  password: JoiValidator.validatePassword().required()
});

export const isID = Joi.object({
  id: JoiValidator.validateID().required()
});
