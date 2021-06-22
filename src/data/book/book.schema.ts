import { SchemaFactory } from "../database";
import { trimmedString } from "../util/schema";
import { SchemaTypes } from "mongoose";

export const BookSchema = SchemaFactory({
  title: { ...trimmedString, required: true, index: true },
  author: { ...trimmedString, required: true, index: true },
  year: { type: SchemaTypes.Number, required: true, index: true },
  total_sold: { type: SchemaTypes.Number, required: true, index: true, default: 0 },
  likes: { type: SchemaTypes.Number, required: true, index: true, default: 0 },
  rating: { type: SchemaTypes.Number, required: true, index: true, default: 0},
  genre: { ...trimmedString, required: true, index: true },
  tags: { type: SchemaTypes.Array, required: true, index: true },
  publisher: { ...trimmedString, required: true, index: true },
  released_date: { type: SchemaTypes.Date, required: true, index: true },
  slug: { ...trimmedString, required: true, index: true },
  description: { ...trimmedString, required: true, index: true },
  price: { type: SchemaTypes.Number, required: true, index: true },
  available_copies: { type: SchemaTypes.Number, required: true, index: true, default: 0 },
  total_copies: { type: SchemaTypes.Number, required: true, index: true, default: 0 },
});
