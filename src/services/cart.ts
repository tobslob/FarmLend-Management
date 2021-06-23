import { Books } from "./book";
import { Store } from "@app/common/services";
import { Cart } from "@app/data/cart/cart.model";
import { Request } from "express";

class CartService {
  constructor() {}

  async addToCart(bookId: string, req: Request) {
    const book = await Books.getBook(bookId);

    if(book.total_copies <= 0) {
      throw new Error(`${book.title} is not more available`)
    }

    const cart: Cart = {
      ...book,
      quantity: 1,
      total_price: book.price
    }

    const userId = req["user"].id;
    return await Store.hset(`${userId}::${book.title}`, "carts", JSON.stringify(cart));
  }

  async incrementBookInCart(bookTitle: string, req: Request) {
    const userId = req["user"].id;
    const cart = await Store.hget(`${userId}::${bookTitle}`, "carts");

    if(!cart) {
      return null
    }

    const objCart: Cart = JSON.parse(cart);

    if(objCart.quantity > objCart.total_copies) {
      throw new Error(`${bookTitle} is out of stock`);
    }

    objCart["quantity"] += 1;
    objCart["total_price"] = objCart.quantity * objCart.price;

    return await Store.hset(`${userId}::${bookTitle}`, "carts", JSON.stringify(objCart));
  }

  async decrementBookInCart(bookTitle: string, req: Request) {
    const userId = req["user"].id;
    const cart = await Store.hget(`${userId}::${bookTitle}`, "carts");

    if(!cart) {
      return null
    }
    const objCart: Cart = JSON.parse(cart);

    if(objCart.quantity == 1) {
      throw new Error("Your quantity can not be less than one.")
    }

    objCart["quantity"] -= 1;
    objCart["total_price"] = objCart.quantity * objCart.price;
    return await Store.hset(`${userId}::${bookTitle}`, "carts", JSON.stringify(objCart));
  }

  async getCarts(req: Request) {
    const userId = req["user"].id;
    const carts = await Store.hgetall(`${userId}::*`).then(cart => (
      Object.keys(cart).map((key) => JSON.parse(cart[key]))
     ));

     carts.push({ cart_price: 0 });

     for(const cart in carts) {
       carts["cart_price"] += cart["total_price"]
     }

     return carts
  }

  async getCart(bookTitle: string, req: Request) {
    const userId = req["user"].id;
    const cart = await Store.hget(`${userId}::${bookTitle}`, "carts");

    if(!cart) {
      return null
    }
    const objCart: Cart = JSON.parse(cart);
    return objCart
  }

  async deleteFromCart(bookTitle: string, req: Request) {
    const userId = req["user"].id;
    return await Store.hdel(`${userId}::${bookTitle}`)
  }

  async checkOut(req: Request) {
    // TODO
    // const carts = await this.getCarts(req);
    // check if total quantity of each books in cart are available in mongo
    // if the total quantity is less than quantity in cart, update redis storage with actual total_quantity,
    // and throw error to user
    // integrate payment gateway, after successful payment, update mongo db with the new total_quanty
    // update order history table
    // clear cart for that user
  }
}

export const Carts = new CartService();
