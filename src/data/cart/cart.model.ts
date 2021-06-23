import { BookDTO } from "../book";

export interface Cart extends BookDTO {
  quantity: number;
  total_price: number;
}

export interface CartDTO {
  bookId?: string;
  bookTitle?: string;
}
