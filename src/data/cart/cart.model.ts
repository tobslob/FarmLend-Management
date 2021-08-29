import { Model } from "../database";

export interface Cart extends Model {
  bookId: string;
  bookTitle: string;
  quantity: number;
  price: number;
  totalPrice: number;
  userId: string;
}

export interface CartDTO {
  bookId?: string;
}
