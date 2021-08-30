import { SchemaFactory } from "../database";
import { trimmedString } from "../util/schema";
import { SchemaTypes } from "mongoose";

export const CartSchema = SchemaFactory({
  book_id: { ...trimmedString, required: true, index: true, unique: true },
  book_title: { ...trimmedString, required: true, index: true, unique: true },
  quantity: { type: SchemaTypes.Number, required: true},
  price: { type: SchemaTypes.Number, required: true },
  total_price: { type: SchemaTypes.Number, required: true },
  user_id: { ...trimmedString, required: true, index: true, unique: true },
});
