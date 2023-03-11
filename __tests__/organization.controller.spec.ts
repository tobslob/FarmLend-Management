import 'module-alias/register';
import 'reflect-metadata';
import sinon from 'sinon';
import supertest, { SuperTest, Test } from 'supertest';
import { App } from '../src/server/app';
import { StatusCodes } from 'http-status-codes';
import { FakeData } from './mocks/data';
import { createSession, createJsonWebToken, repeat } from './helpers';
import { orgRepo } from '../src/data/repositories/organization.repo';
import { Organizations } from '../src/services/organization';
import { OrganizationType } from '../src/data/models/organization.model';

let app: App
let request: SuperTest<Test>

const baseUrl = '/api/v1/organizations'
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
//   await app.closeDB()
})

afterEach(async () => {
  sinon.resetHistory()
  sinon.resetBehavior()

  await orgRepo.truncate()
})

describe('Create Organizations', () => {
  it('reject unsecure user', async () => {
    const { body } = await request.post(baseUrl).expect(StatusCodes.UNAUTHORIZED)

    expect(body.message).toMatch(
      `There's no session associated with this request`,
    )
  })

  it('Successfully create organization', async () => {

    const { body } = await request
      .post(baseUrl)
      .set('Authorization', token)
      .send(fake.createOrganization())
      .expect(StatusCodes.OK)

    expect(body.data).toHaveProperty("createdAt")
  })

  it.skip('Get all organization', async () => {
    await repeat(5, async () => await Organizations.createOrganization(fake.createOrganization()))

    const { body } = await request
      .get(`${baseUrl}/type=${OrganizationType.SELLER}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data.length).toBe(5)
  })

  it('Get an organization', async () => {
    const organization = await Organizations.createOrganization(fake.createOrganization())

    const {
      body,
    } = await request
      .get(`${baseUrl}/${organization["id"]}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data.id).toBe(organization["id"])
  })

  it('Delete a product', async () => {
    const organization = await Organizations.createOrganization(fake.createOrganization())

    const {
      body,
    } = await request
      .delete(`${baseUrl}/${organization["id"]}`)
      .set('Authorization', token)
      .expect(StatusCodes.OK)

    expect(body.data).toBe(1)
  })

  it('Successfully patch an organization', async () => {
    const organization = await Organizations.createOrganization(fake.createOrganization())

    const data = {
      name: "TOBSLOB ORG",
      type: OrganizationType.SELLER
    }

    const { body } = await request
      .patch(`${baseUrl}/${organization["id"]}`)
      .set('Authorization', token)
      .send(data)
      .expect(StatusCodes.OK)

    expect(body.data.name).toBe(data.name)
    expect(body.data.type).toBe(data.type)
  })
})
