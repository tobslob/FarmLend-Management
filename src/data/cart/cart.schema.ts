import { SchemaFactory } from "../database";
import { trimmedString } from "../util/schema";
import { SchemaTypes } from "mongoose";

export const CartSchema = SchemaFactory({
  bookId: { ...trimmedString, required: true, index: true, unique: true },
  bookTitle: { ...trimmedString, required: true, index: true, unique: true },
  quantity: { type: SchemaTypes.Number, required: true},
  price: { type: SchemaTypes.Number, required: true },
  totalPrice: { type: SchemaTypes.Number, required: true },
  userId: { ...trimmedString, required: true, index: true, unique: true },
});
