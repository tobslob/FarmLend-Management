import { Model } from "../database";

export interface Cart extends Model {
  book_id: string;
  book_title: string;
  quantity: number;
  price: number;
  total_price: number;
  user_id: string;
}

export interface CartDTO {
  book_id?: string;
}
