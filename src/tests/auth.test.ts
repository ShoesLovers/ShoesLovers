import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import AccountModel from '../models/accountModel'
import { Express } from 'express'
import jwt from 'jsonwebtoken'

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
  test('duplicate Register test', async () => {
    const response = await request(app).post('/auth/register').send(account)
    expect(response.status).toEqual(400)
  })

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
  test('Test Login with wrong password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: account.email, password: '' })
    expect(response.statusCode).toBe(400)
  })
  test('Test Login with wrong password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: account.email, password: '' })
    expect(response.statusCode).toBe(400)
  })
  test('Login with missing email or password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: '', password: account.password })
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('email or password is null')
  })

  test('Login with non-existing user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'nonexisting@test.com', password: account.password })

    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('user is not exists')
  })

  test('Login with invalid password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: account.email, password: 'invalidpassword' })

    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('invalid password')
  })

  test('should set account.refreshTokens to an array containing refreshToken if account.refreshTokens is not set', () => {
    const account: { refreshTokens?: string[] } = {} // Add type annotation
    const refreshToken = 'some_refresh_token'
    if (!account.refreshTokens) {
      account.refreshTokens = [refreshToken]
    }
    expect(account.refreshTokens).toEqual([refreshToken])
  })
  test('should not overwrite existing account.refreshTokens', () => {
    const existingRefreshToken = 'existing_refresh_token'
    const account = { refreshTokens: [existingRefreshToken] }
    const newRefreshToken = 'new_refresh_token'
    if (!account.refreshTokens) {
      account.refreshTokens = [newRefreshToken]
    }
    expect(account.refreshTokens).toEqual([existingRefreshToken])
  })

  test('Test forbidden access without token', async () => {
    const response = await request(app).get('/account')
    expect(response.statusCode).toBe(500)
  })

  test('Test access with valid token', async () => {
    const response = await request(app)
      .get('/account')
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.statusCode).toBe(200)
  })

  test('Test access with invalid token', async () => {
    const response = await request(app)
      .get('/user')
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.statusCode).toBe(404)
  })

  test('Test refresh token', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .set('Authorization', `JWT ${refreshToken}`)
      .send()
    expect(response.statusCode).not.toBe(200)
  })

  test('Test not valid token', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .set('Authorization', `JWT 123`)
      .send()
    expect(response.statusCode).toBe(404)
  })

  jest.setTimeout(10000)
  test('Test access after timeout of token', async () => {
    await new Promise(resolve => setTimeout(() => resolve('done'), 5000))

    const response = await request(app)
      .get('/account')
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
      .get('/account')
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

  test('Login with valid email and password', async () => {
    const response = await request(app).post('/auth/login').send(account)
    expect(response.statusCode).toBe(200)
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
    expect(accessToken).toBeDefined()
  })

  test('Logout test', async () => {
    const response = await request(app).post('/auth/logout')
    expect(response.statusCode).toBe(401)
  })
  test('Logout test', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `JWT 123`)
    expect(response.statusCode).toBe(401)
  })
  test('Logout test', async () => {
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `JWT ${refreshToken}`)
    expect(response.statusCode).toBe(200)
  })

  test('Logout with deleted account', async () => {
    // Generate an account an delete it and test if the logout still works
    const newAccount = await AccountModel.create(account)
    const refreshToken = jwt.sign(
      { _id: newAccount._id },
      process.env.JWT_REFRESH_SECRET
    )
    newAccount.refreshTokens = [refreshToken]
    await newAccount.save()
    const response = await request(app)
      .post('/auth/logout')
      .set('Authorization', `JWT ${refreshToken}`)
    expect(response.statusCode).toBe(200)
    await request(app).delete(`/account/${newAccount._id}`)
    const response1 = await request(app)
      .post('/auth/logout')
      .set('Authorization', `JWT ${refreshToken}`)
    expect(response1.statusCode).toBe(401)
  })

  test('Test access after logout', async () => {
    const response = await request(app)
      .get('/account')
      .set('Authorization', `JWT ${refreshToken}`)
    expect(response.statusCode).toBe(500)
  })

  test('Test double use of refresh token', async () => {
    const response = await request(app)
      .get('/auth')
      .set('Authorization', `JWT ${accessToken}`)
      .send()
    expect(response.statusCode).not.toBe(200)

    const response1 = await request(app)
      .get('/auth')
      .set('Authorization', `JWT ${accessToken}`)
      .send()
    expect(response1.statusCode).not.toBe(200)
  })
})
