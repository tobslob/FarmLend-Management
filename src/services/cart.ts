import { Books } from './book'
import { Request } from 'express'
import { CartRepo } from '@app/data/cart/cart.repo'

class CartService {
  async createCart(bookId: string, req: Request) {
    const book = await Books.getBook(bookId)

    if (book.available_copies <= 0) {
      throw new Error(`${book.title} is out of stock`)
    }

    const isCart = await CartRepo.model.exists({ bookId })

    if (isCart) {
      const cart = await CartRepo.byQuery({ userId: req['user'].id, bookId })

      return await CartRepo.atomicUpdate(
        { userId: req['user'].id, bookId },
        {
          $inc: { quantity: 1 },
          $set: { totalPrice: cart.totalPrice + cart.price },
        },
      )
    }

    return await CartRepo.create({
      bookId,
      bookTitle: book.title,
      price: book.price,
      totalPrice: book.price,
      quantity: 1,
    })
  }

  async incrementCart(bookId: string, req: Request) {
    const cart = await CartRepo.byQuery({ userId: req['user'].id, bookId })
    return await CartRepo.atomicUpdate(
      { userId: req['user'].id, bookId },
      {
        $inc: { quantity: 1 },
        $set: { totalPrice: cart.totalPrice + cart.price },
      },
    )
  }

  async decrementCart(bookId: string, req: Request) {
    const cart = await CartRepo.byQuery({ userId: req['user'].id, bookId })
    return await CartRepo.atomicUpdate(
      { userId: req['user'].id, bookId },
      {
        $inc: { quantity: -1 },
        $set: { totalPrice: cart.totalPrice - cart.price },
      },
    )
  }

  async getCarts(req: Request) {
    return await CartRepo.all({ conditions: { userId: req['user'].id } })
  }

  async getCart(bookId: string, req: Request) {
    const userId = req['user'].id
    return await CartRepo.byQuery({ userId, bookId })
  }

  async removeFromCart(bookId: string, req: Request) {
    const userId = req['user'].id
    return await CartRepo.destroy({ bookId, userId })
  }

  async checkOut(req: Request) {
    const carts = await this.getCarts(req)
    let cartsTotalPrice = 0
    let verb
    Promise.all(
      carts.map(async (cart) => {
        const book = await CartRepo.byID(cart.bookId)
        if (!(book.quantity < cart.quantity)) {
          verb = book.quantity > 1 ? (verb = 'are') : (verb = 'is')
          throw new Error(
            `There ${verb} only ${book.quantity} ${cart.bookTitle} available`,
          )
        }
        cartsTotalPrice = cartsTotalPrice + cart.totalPrice;
      }),
    )
    // TODO:implement payment integration and save to orders record
    return cartsTotalPrice
  }
}

export const Carts = new CartService()
