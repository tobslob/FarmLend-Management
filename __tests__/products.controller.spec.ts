import 'module-alias/register';
import 'reflect-metadata';
import sinon from 'sinon';
import supertest, { SuperTest, Test } from 'supertest';
import { App } from '../src/server/app';
import { productRepo } from "../src/data/repositories/product.repo";
import { userRepo } from '../src/data/repositories/user.repo';
import { StatusCodes } from 'http-status-codes';
import { FakeData } from './mocks/data';
import { createSession, createJsonWebToken, repeat } from './helpers';
import { orgRepo } from '../src/data/repositories/organization.repo';

let app: App
let request: SuperTest<Test>

const baseUrl = '/api/v1/products'
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
  await orgRepo.truncate()
  await app.closeDB()
})

afterEach(async () => {
  sinon.resetHistory()
  sinon.resetBehavior()

  await productRepo.truncate()
})

describe('Create Product', () => {
  it('reject unsecure user', async () => {
    const { body } = await request.post(baseUrl).expect(StatusCodes.UNAUTHORIZED)

    expect(body.message).toMatch(
      `There's no session associated with this request`,
    )
  })

  it('Successfully create product', async () => {

    const { body } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send(fake.createProduct())
      .expect(StatusCodes.OK)

    expect(body.data).toHaveProperty("createdAt")
  })

  it('Get all products', async () => {
    await repeat(5, async () => await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]}))

    const { body } = await request
      .get(baseUrl)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data.length).toBe(5)
  })

  it('Get a product', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})

    const {
      body,
    } = await request
      .get(`${baseUrl}/${product["id"]}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data.id).toBe(product["id"])
  })

  it('Delete a product', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})

    const {
      body,
    } = await request
      .delete(`${baseUrl}/${product["id"]}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data).toBe(1)
  })

  it('Successfully patch a product', async () => {
    const product = await productRepo.create({...fake.createProduct(), organizationId: user["organizationId"]})

    const data = {
      category: "Banana",
      variety: "Delicious",
      packaging: "40KG Boxes, 75 kg mesh bags",
      volume: 100
    }

    const { body } = await request
      .patch(`${baseUrl}/${product["id"]}`)
      .set('Authorization', token)
      .send(data)
      .expect(StatusCodes.OK)

    expect(body.data.category).toBe(data.category)
    expect(body.data.variety).toBe(data.variety)
    expect(body.data.volume).toBe(data.volume)
    expect(body.data.packaging).toBe(data.packaging)
  })
})
