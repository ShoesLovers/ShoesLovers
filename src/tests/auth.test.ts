import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import AccountModel from '../models/account_model'
import { Express } from 'express'

let app: Express
const account = {
  email: 'testUser@test.com',
  password: '1234567890',
  name: 'testUser',
}
beforeAll(async () => {
  app = await initApp()
  console.log('before all')
  await AccountModel.deleteMany({ email: account.email })
})

afterAll(done => {
  mongoose.connection.close()
  done()
})
let accessToken: string
let refreshToken: string
let newRefreshToken: string
describe('Auth tests', () => {
  test(' Register test', async () => {
    const response = await request(app).post('/auth/register').send(account)
    expect(response.status).toEqual(201)
  })
  test('Test Register exist email', async () => {
    const response = await request(app).post('/auth/register').send(account)
    expect(response.statusCode).toBe(400)
  })
  // test(" duplicate Register test", async () => {
  //   const response = await request(app).post("/auth/register").send(account);
  //   expect(response.status).toEqual(400);
  // });

  test('Test Register missing password', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@test.com',
    })
    expect(response.statusCode).toBe(400)
  })
  test('Test Login', async () => {
    const response = await request(app).post('/auth/login').send(account)
    expect(response.statusCode).toBe(200)
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
    expect(accessToken).toBeDefined()
  })

  test('Test forbidden access without token', async () => {
    const response = await request(app).get('/user')
    expect(response.statusCode).toBe(401)
  })

  test('Test access with valid token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', 'JWT ' + accessToken)
    expect(response.statusCode).toBe(200)
  })

  test('Test access with invalid token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', 'JWT' + accessToken + '1')
    expect(response.statusCode).toBe(401)
  })
  // test(" Logout test", async () => {
  //   const response = await request(app).post("/auth/logout").send({
  //     email: "test",
  //     password: "test",
  //   });
  //   expect(response.status).toEqual(200);
  // });
  jest.setTimeout(10000)
  test('Test access after timeout of token', async () => {
    await new Promise(resolve => setTimeout(() => resolve('done'), 5000))

    const response = await request(app)
      .get('/student')
      .set('Authorization', 'JWT ' + accessToken)
    expect(response.statusCode).not.toBe(200)
  })
  test('Test refresh token', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'JWT ' + refreshToken)
      .send()
    expect(response.statusCode).toBe(200)
    expect(response.body.accessToken).toBeDefined()
    expect(response.body.refreshToken).toBeDefined()

    const newAccessToken = response.body.accessToken
    newRefreshToken = response.body.refreshToken

    const response2 = await request(app)
      .get('/student')
      .set('Authorization', 'JWT ' + newAccessToken)
    expect(response2.statusCode).toBe(200)
  })

  test('Test double use of refresh token', async () => {
    const response = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'JWT ' + refreshToken)
      .send()
    expect(response.statusCode).not.toBe(200)

    //verify that the new token is not valid as well
    const response1 = await request(app)
      .get('/auth/refresh')
      .set('Authorization', 'JWT ' + newRefreshToken)
      .send()
    expect(response1.statusCode).not.toBe(200)
  })
})
