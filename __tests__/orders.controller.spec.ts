import 'module-alias/register';
import 'reflect-metadata';
import sinon from 'sinon';
import supertest, { SuperTest, Test } from 'supertest';
import { App } from '../src/server/app';
import { orderRepo } from "../src/data/repositories/order.repo";
import { StatusCodes } from 'http-status-codes';
import { FakeData } from './mocks/data';
import { createSession, createJsonWebToken, repeat } from './helpers';
import { productRepo } from '../src/data/repositories/product.repo';
import { OrderType } from '../src/data/models/order.model';
import { userRepo } from '../src/data/repositories/user.repo';

let app: App
let request: SuperTest<Test>

const baseUrl = '/api/v1/orders'
const fake = new FakeData()
let token: string
let user: object
beforeAll(async () => {
  app = new App()
  await app.connectDB()

  const server = app.getServer().build()
  request = supertest(server)

  user = await fake.testerUser()

  const session = createSession(user["id"], user)
  token = await createJsonWebToken(session)
})

afterAll(async () => {
  await userRepo.truncate()
  await productRepo.truncate()
  await app.closeDB()
})

afterEach(async () => {
  sinon.resetHistory()
  sinon.resetBehavior()

  await orderRepo.truncate()
})

describe('Create Order', () => {
  it('reject unsecure user', async () => {
    const { body } = await request.post(baseUrl).expect(StatusCodes.UNAUTHORIZED)

    expect(body.message).toMatch(
      `There's no session associated with this request`,
    )
  })

  it('Successfully create order', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})
    const { body } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send(fake.createOrder(product["id"]))
      .expect(StatusCodes.OK)

    expect(body.data).toHaveProperty("createdAt")
  })

  it('Get all orders', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})
    await repeat(5, async () => await orderRepo.create({...fake.createOrder(product["id"]), organizationId: user["organizationId"]}))

    const { body } = await request
      .get(baseUrl)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data.length).toBe(5)
  })

  it('Get a order', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})
    const order = await orderRepo.create({...fake.createOrder(product["id"]), organizationId: user["organizationId"]})

    const {
      body,
    } = await request
      .get(`${baseUrl}/${order["id"]}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data.id).toBe(order["id"])
  })

  it('Successfully patch an order', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})
    const order = await orderRepo.create({...fake.createOrder(product["id"]), organizationId: user["organizationId"]})

    const data = {
      type: OrderType.BUY,
      products: [{
        productId: product["id"],
        volume: 50
      }]
    }

    const { body } = await request
      .patch(`${baseUrl}/${order["id"]}`)
      .set('Authorization', token)
      .send(data)
      .expect(StatusCodes.OK)

    expect(body.data["type"]).toBe(data.type)
  })

  it('Delete an order', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})
    const order = await orderRepo.create({...fake.createOrder(product["id"]), organizationId: user["organizationId"]})

    const {
      body,
    } = await request
      .delete(`${baseUrl}/${order["id"]}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data).toBe(1)
  })
})
