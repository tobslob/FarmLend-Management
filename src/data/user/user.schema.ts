import { SchemaFactory } from "../database";
import { trimmedString } from "../util/schema";

export const UserSchema = SchemaFactory({
  first_name: { ...trimmedString, required: true, index: true },
  last_name: { ...trimmedString, required: true, index: true },
  email_address: { ...trimmedString, required: true, index: true },
  location: { ...trimmedString, required: true, index: true },
  password: { ...trimmedString, required: true, index: true }
});
