import { Books } from '../../src/services/book'
import { Users } from '../../src/services/user'
import { Carts } from '../../src/services/cart'
import faker from 'faker'
import { Request, Response } from 'express'

export const createBook = async (req: Request, res: Response) => {
  return await Books.addBook(
    {
      title: faker.name.title(),
      author: faker.name.findName(),
      year: faker.random.arrayElement(['2019', '2020']),
      total_sold: faker.datatype.number(1),
      likes: faker.datatype.number(5),
      rating: faker.datatype.number(4),
      genre: faker.music.genre(),
      tags: faker.random.arrayElements([
        'friction',
        'passion',
        'motivation',
        'marketing',
      ]),
      publisher: faker.company.companyName(),
      released_date: faker.date.past(),
      slug: faker.random.word(),
      description: faker.random.word(),
      price: faker.datatype.number(),
      available_copies: 20,
    },
    req,
    res,
  )
}

export const createUser = async () => {
  return await Users.createUser({
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email_address: faker.internet.email(),
    location: faker.address.cityName(),
    password: faker.internet.password(),
  })
}

export const createCart = async (id: string, req: Request) => {
  return await Carts.createCart(id, req)
}

export const bookDTO = () => {
  return {
    title: faker.name.title(),
    author: faker.name.findName(),
    year: faker.random.arrayElement(['2019', '2020']),
    total_sold: faker.datatype.number(1),
    likes: faker.datatype.number(5),
    rating: faker.datatype.number(4),
    genre: faker.music.genre(),
    tags: faker.random.arrayElements([
      'friction',
      'passion',
      'motivation',
      'marketing',
    ]),
    publisher: faker.company.companyName(),
    released_date: faker.date.past(),
    slug: faker.random.word(),
    description: faker.random.word(),
    price: faker.datatype.number(),
    available_copies: 20,
  }
}
