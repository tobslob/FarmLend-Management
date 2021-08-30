import 'module-alias/register'
import 'reflect-metadata'
import sinon from 'sinon'
import supertest, { SuperTest, Test } from 'supertest'
import { App } from '../src/server/app'
import { BookRepo } from '../src/data/book'
import { UNAUTHORIZED, OK } from 'http-status-codes'
import { createSession, createJsonWebToken, repeat } from './helpers'
import { createUser, createBook, bookDTO } from './mocks/services'
import { Request, Response } from 'express'

let app: App
let request: SuperTest<Test>
let req: Request
let res: Response

const baseUrl = '/api/v1/books'

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

  await BookRepo.truncate({})
})

describe('Create book', () => {
  it('reject unsecure user', async () => {
    const { body } = await request.post(baseUrl).expect(UNAUTHORIZED)

    expect(body.message).toMatch(
      `There's no session associated with this request`,
    )
  })

  it('Successfully create book', async () => {
    const user = await createUser()

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const { body } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send(bookDTO())
      .expect(OK)

    expect(body.data).toHaveProperty("created_at")
  })

  it('Get all books', async () => {
    const user = await createUser()
    await repeat(5, async () => await createBook(req, res))

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const { body } = await request
      .get(baseUrl)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.length).toBe(5)
  })

  it('Get a book', async () => {
    const user = await createUser()
    const book = await await createBook(req, res)

    const session = createSession(user._id)
    const token = await createJsonWebToken(session)

    const {
      body,
    } = await request
      .get(`${baseUrl}/${book.id}`)
      .set('Authorization', token)
      .expect(OK)

    expect(body.data.id).toBe(book.id)
  })
})
