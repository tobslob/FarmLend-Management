import { Books } from './book'
import { Request } from 'express'
import { CartRepo } from '@app/data/cart/cart.repo'

class CartService {
  async createCart(book_id: string, req: Request) {
    const book = await Books.getBook(book_id);

    if (book.available_copies <= 0) {
      throw new Error(`${book.title} is out of stock`)
    }

    const isCart = await CartRepo.model.exists({ book_id })

    if (isCart) {
      const cart = await CartRepo.byQuery({ user_id: req['user'].id, book_id })

      return await CartRepo.atomicUpdate(
        { userId: req['user'].id, book_id },
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

  async incrementCart(book_id: string, req: Request) {
    const cart = await CartRepo.byQuery({ userId: req['user'].id, book_id })
    return await CartRepo.atomicUpdate(
      { userId: req['user'].id, book_id },
      {
        $inc: { quantity: 1 },
        $set: { total_price: cart.total_price + cart.price },
      },
    )
  }

  async decrementCart(book_id: string, req: Request) {
    const cart = await CartRepo.byQuery({ userId: req['user'].id, book_id })
    return await CartRepo.atomicUpdate(
      { userId: req['user'].id, book_id },
      {
        $inc: { quantity: -1 },
        $set: { total_price: cart.total_price - cart.price },
      },
    )
  }

  async getCarts(req: Request) {
    return await CartRepo.all({ conditions: { userId: req['user'].id } })
  }

  async getCart(book_id: string, req: Request) {
    const userId = req['user'].id
    return await CartRepo.byQuery({ userId, book_id })
  }

  async removeFromCart(book_id: string, req: Request) {
    const userId = req['user'].id
    return await CartRepo.destroy({ book_id, userId })
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
