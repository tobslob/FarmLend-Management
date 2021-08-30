import { Books } from './book'
import { Request } from 'express'
import { CartRepo } from '@app/data/cart/cart.repo'

class CartService {
  async createCart(book_id: string, req: Request) {
    const book = await Books.getBook(book_id);

    if (book.available_copies <= 0) {
      throw new Error(`${book.title} is out of stock`)
    }

    const isCart = await CartRepo.model.exists({ book_id });

    if (isCart) {
      const cart = await CartRepo.byQuery({ user_id: req['user'].id, book_id })

      return await CartRepo.atomicUpdate(
        { user_id: req['user'].id, book_id },
        {
          $inc: { quantity: 1 },
          $set: { total_price: cart.total_price + cart.price },
        },
      )
    }

    return await CartRepo.create({
      book_id,
      book_title: book.title,
      price: book.price,
      total_price: book.price,
      quantity: 1,
      user_id: req['user'].id
    })
  }

  async incrementCart(_id: string, req: Request) {
    const cart = await CartRepo.byQuery({ user_id: req['user'].id, _id })
    return await CartRepo.atomicUpdate(
      { user_id: req['user'].id, _id },
      {
        $inc: { quantity: 1 },
        $set: { total_price: cart.total_price + cart.price },
      },
    )
  }

  async decrementCart(_id: string, req: Request) {
    const cart = await CartRepo.byQuery({ user_id: req['user'].id, _id })
    const decreCart = await CartRepo.atomicUpdate(
      { user_id: req['user'].id, _id },
      {
        $inc: { quantity: -1 },
        $set: { total_price: cart.total_price - cart.price },
      },
    )

    if (decreCart.quantity <= 0) {
      await CartRepo.destroy(cart.id);
    }

    return decreCart;
  }

  async getCarts(req: Request) {
    return await CartRepo.all({ conditions: { user_id: req['user'].id } })
  }

  async getCart(_id: string, req: Request) {
    const user_id = req['user'].id
    return await CartRepo.byQuery({ user_id, _id })
  }

  async removeFromCart(id: string, req: Request) {
    const user_id = req['user'].id
    return await CartRepo.destroy({ id, user_id });
  }

  async checkOut(req: Request) {
    const carts = await this.getCarts(req)
    let cartsTotal_price = 0
    let verb
    Promise.all(
      carts.map(async (cart) => {
        const book = await CartRepo.byID(cart.book_id)
        if (!(book.quantity < cart.quantity)) {
          verb = book.quantity > 1 ? (verb = 'are') : (verb = 'is')
          throw new Error(
            `There ${verb} only ${book.quantity} ${cart.book_title} available`,
          )
        }
        cartsTotal_price = cartsTotal_price + cart.total_price;
      }),
    )
    // TODO:implement payment integration and save to orders record
    return cartsTotal_price
  }
}

export const Carts = new CartService()
