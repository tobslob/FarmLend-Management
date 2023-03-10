import { OrderType } from "@app/data/models";
import { JoiValidator } from "@app/data/util";
import Joi from "@hapi/joi";
import { values } from "lodash";

export const isOrder = Joi.object({
  type: JoiValidator.validateString().valid(values(OrderType)).required(),
  references: JoiValidator.validateID(),
  category: JoiValidator.validateString(),
  variety: JoiValidator.validateString()
});

export const isQuery = Joi.object({
  type: JoiValidator.validateString().valid(values(["buyer", "seller", "buy", "sell"])),
  organizationId: JoiValidator.validateID(),
  name: JoiValidator.validateString(),
  category: JoiValidator.validateString(),
  variety: JoiValidator.validateString()
});
