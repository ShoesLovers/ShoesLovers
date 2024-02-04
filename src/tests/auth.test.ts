import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import AccountModel from '../models/accountModel'
import { Express } from 'express'
import jwt from 'jsonwebtoken'

import {
  registerAccount,
  loginAccount,
  logoutAccount,
  createAccountObject,
  getAllAccounts,
  getAccessToken,
} from '../helpers/testsHelpers'

let app: Express
let accessToken: string
let refreshToken: string

const account = createAccountObject('test@gmail.com', '1234', 'testUser')

afterAll(async () => {
  await AccountModel.deleteMany()
  await mongoose.connection.close()
})

describe('Auth tests', () => {
  beforeAll(async () => {
    app = await initApp()
    console.log('before all')
    await AccountModel.deleteMany()
  })

  test('Test Create Account', async () => {
    const response = await registerAccount(app, account)
    expect(response.status).toEqual(201)
  })

  test('Test Create New Account with same details', async () => {
    const response = await registerAccount(app, account)
    expect(response.statusCode).toBe(400)
  })

  test('Test Missing password', async () => {
    const response = await request(app).post('/auth/register').send({
      email: 'test@test.com',
    })
    expect(response.statusCode).toBe(400)
  })

  test('Test Login', async () => {
    const response = await loginAccount(app, account)
    expect(response.statusCode).toBe(200)
    expect(response.body.accessToken).toBeDefined()
    expect(response.body.refreshToken).toBeDefined()
    accessToken = response.body.accessToken
    refreshToken = response.body.refreshToken
  })

  test('Test Login with wrong password', async () => {
    const wrongPassword = createAccountObject(
      account.email,
      'wrongPassword',
      account.name
    )
    const response = await loginAccount(app, wrongPassword)
    expect(response.statusCode).toBe(400)
  })

  test('Test Login with wrong password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: account.email, password: '' })
    expect(response.statusCode).toBe(400)
  })

  test('Login with missing email and password', async () => {
    const missingEmailandPassword = createAccountObject('', '', account.name)

    const response = await loginAccount(app, missingEmailandPassword)
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('email or password is null')
  })

  test('Login with missing email', async () => {
    const missingEmail = createAccountObject('', account.password, account.name)

    const response = await loginAccount(app, missingEmail)
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('email or password is null')
  })

  test('Login with missing password', async () => {
    const missingPassword = createAccountObject(account.email, '', account.name)

    const response = await loginAccount(app, missingPassword)
    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('email or password is null')
  })

  test('Login with non-existing user', async () => {
    const nonExistingUser = createAccountObject(
      'nonexisting@test.com',
      '1234',
      'noneexistinguser'
    )

    const response = await loginAccount(app, nonExistingUser)

    expect(response.statusCode).toBe(400)
    expect(response.text).toBe('user is not exists')
  })

  test('Test if there is none refresh tokens so should be an array of one refresh token.', () => {
    const account: { refreshTokens?: string[] } = {}
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

  test('Test forbidden access to all Accounts without token', async () => {
    const response = await getAllAccounts(app, null)
    expect(response.statusCode).toBe(500)
  })

  test('Test access to all Accounts with valid token', async () => {
    const response = await getAllAccounts(app, accessToken)
    expect(response.statusCode).toBe(200)
  })

  test('Test Getting Access Token by Using a valid Refresh Token.', async () => {
    const response = await getAccessToken(app, refreshToken)
    expect(response.statusCode).toBe(200)
  })

  test('Test Getting Access Token by Using not-valid Refresh Token', async () => {
    const response = await getAccessToken(app, '123')
    expect(response.statusCode).toBe(404)
  })

  test('Test double use of the same Refresh Token', async () => {
    const response1 = await getAccessToken(app, refreshToken)
    expect(response1.statusCode).not.toBe(200)

    const response2 = await getAccessToken(app, refreshToken)
    expect(response2.statusCode).not.toBe(200)
  })

  test('Logout test with overuse Refresh Token', async () => {
    const response = await logoutAccount(app, refreshToken)
    expect(response.statusCode).toBe(401)
  })

  let newRefreshToken: string
  test('Logout test with valid Refresh Token', async () => {
    const loginRes = await loginAccount(app, account)
    newRefreshToken = loginRes.body.refreshToken
    const response = await logoutAccount(app, newRefreshToken)
    expect(response.statusCode).toBe(200)
  })

  test('Logout with deleted account', async () => {
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
})
