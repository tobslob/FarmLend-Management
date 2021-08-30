import 'module-alias/register'
import 'reflect-metadata'
import sinon from 'sinon'
import supertest, { SuperTest, Test } from 'supertest'
import { App } from '../src/server/app'
import { CartRepo } from '../src/data/cart'
import { UNAUTHORIZED, OK } from 'http-status-codes'
import { createSession, createJsonWebToken, repeat } from './helpers'
import { createUser, createBook } from './mocks/services'
import { Request, Response } from 'express'

let app: App
let request: SuperTest<Test>
let req: Request
let res: Response

const baseUrl = '/api/v1/carts'

beforeAll(async () => {
  app = new App()
  await app.connectDB()

  const server = app.getServer().build()
  request = supertest(server)
})

afterAll(async () => {
  await app.closeDB()
})

afterEach(async () => {
  sinon.resetHistory()
  sinon.resetBehavior()

  await CartRepo.truncate({})
})

describe('Creating cart', () => {
  it('reject unsecure user', async () => {
    const { body } = await request.post(baseUrl).expect(UNAUTHORIZED)

    expect(body.message).toMatch(
      `There's no session associated with this request`,
    )
  })

  it('Successfully create cart', async () => {
    const user = await createUser()
    const book = await createBook(req, res)

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const { body } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send({ book_id: book._id })
      .expect(OK)

    expect(body.data.book_id).toBe(book._id)
  })

  it('Increment cart', async () => {
    const user = await createUser()
    const book = await createBook(req, res)

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const {
      body: { data },
    } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send({ book_id: book._id })
      .expect(OK)

    const { body } = await request
      .post(`${baseUrl}/increment/${data.id}`)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.book_id).toBe(book._id)
    expect(body.data.quantity).toBe(2)
  })

  it('Decrement cart', async () => {
    const user = await createUser()
    const book = await createBook(req, res)

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const {
      body: { data },
    } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send({ book_id: book._id })
      .expect(OK)

    const { body } = await request
      .post(`${baseUrl}/decrement/${data.id}`)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.book_id).toBe(book._id)
    expect(body.data.quantity).toBe(0)
  })

  it('Get all carts', async () => {
    const user = await createUser()
    const books = await repeat(5, async () => await createBook(req, res))

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    await Promise.all(
      books.map(async (book) => {
        await request
          .post(baseUrl)
          .set('Authorization', token)
          .send({ book_id: book._id })
          .expect(OK)
      }),
    )

    const { body } = await request
      .get(baseUrl)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.length).toBe(5)
  })

  it('Get a cart', async () => {
    const user = await createUser()
    const book = await await createBook(req, res)

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const {body : { data }} = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send({ book_id: book._id })
      .expect(OK)

    const {
      body,
    } = await request
      .get(`${baseUrl}/${data.id}`)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.book_id).toBe(book._id)
  })

  it('Delete a cart', async () => {
    const user = await createUser()
    const book = await await createBook(req, res)

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const {body : { data }} = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send({ book_id: book._id })
      .expect(OK)

      console.log(data)

    const {
      body,
    } = await request
      .delete(`${baseUrl}/${data.id}`)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.book_id).toBe(book._id)
  })
})
