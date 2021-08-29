import { connection } from "mongoose";
import { Cart } from "./cart.model";
import { CartSchema } from "./cart.schema";
import { BaseRepository } from "../database";

class CartRepository extends BaseRepository<Cart> {
  constructor() {
    super(connection, "Carts", CartSchema);
  }
}

export const CartRepo = new CartRepository();
