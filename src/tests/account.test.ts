import { Express } from 'express'
import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import AccountModel from '../models/accountModel'
import bcrypt from 'bcrypt'

import {
  registerAccount,
  loginAccount,
  createAccountObject,
  getAllAccounts,
  getAccountById,
  updateAccount,
  deleteAccount,
  getPostsOfAccount,
  createPostObject,
  createPost,
} from '../helpers/testsHelpers'

let app: Express
let dbAccount: request.Response
let login: request.Response
let accessToken: string

const account = createAccountObject('test@gmail.com', '1234', 'testUser')

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Account tests', () => {
  beforeAll(async () => {
    app = await initApp()
    console.log('before all')
    await AccountModel.deleteMany()
  }, 10000)

  test('Test Create Account', async () => {
    dbAccount = await registerAccount(app, account)
    expect(dbAccount.body.name).toEqual('testUser')
    expect(dbAccount.body.email).toEqual('test@gmail.com')
    expect(dbAccount.status).toEqual(201)
    expect(await bcrypt.compare(account.password, dbAccount.body.password))
  })

  test('Login test', async () => {
    login = await loginAccount(app, account)
    expect(login.status).toEqual(200)
    accessToken = login.body.accessToken
  })

  test('Test that only one account exist in DB', async () => {
    const response = await getAllAccounts(app, accessToken)
    expect(response.body.length).toEqual(1)
    const checkAccount = response.body[0]
    expect(checkAccount.name).toEqual(account.name)
    expect(checkAccount.email).toEqual(account.email)
    expect(await bcrypt.compare(account.password, checkAccount.password))
  })

  test('Test get all accounts-fail', async () => {
    const response = await getAllAccounts(app, '123')
    expect(response.status).toEqual(500)
  })

  test('Test add another account with same email', async () => {
    const response = await registerAccount(app, account)
    expect(response.status).toEqual(400)
  })

  test('Test get account by id', async () => {
    const response = await getAccountById(app, dbAccount.body._id, accessToken)
    expect(response.status).toEqual(200)
    expect(response.body.name).toEqual(account.name)
    expect(response.body.email).toEqual(account.email)
  })

  test('Test get account by wrong id', async () => {
    const response = await getAccountById(app, '123', accessToken)
    expect(response.status).toEqual(500)
  })

  test('Test update account by ID', async () => {
    const updatedAccountObj = createAccountObject(
      'newEmail@gmail.com',
      account.password,
      'newName'
    )
    const response = await updateAccount(
      app,
      dbAccount.body._id,
      accessToken,
      updatedAccountObj
    )

    expect(response.status).toEqual(200)
    expect(response.body.name).toEqual('newName')
    expect(response.body.email).toEqual('newEmail@gmail.com')
  })

  test('Test delete account', async () => {
    const newAccount = createAccountObject(
      'newAccount@gmail.com',
      '1234',
      'newAccount'
    )

    const newDbAccount = await registerAccount(app, newAccount)
    const login = await loginAccount(app, newAccount)
    const newAccessToken = login.body.accessToken

    const response = await deleteAccount(
      app,
      newDbAccount.body._id,
      newAccessToken
    )

    expect(response.status).toEqual(200)
    expect(response.text).toEqual('OK')
  })

  test('Test that only one account exist in DB', async () => {
    const response = await getAllAccounts(app, accessToken)
    expect(response.body.length).toEqual(1)
  })

  test('Test delete account with wrong id', async () => {
    const response = await deleteAccount(app, '123', accessToken)
    expect(response.status).toEqual(500)
  })

  test('Test get all posts of account without posts', async () => {
    const response = await getPostsOfAccount(
      app,
      dbAccount.body._id,
      accessToken
    )
    expect(response.status).toEqual(404)
  })

  test('Test get all posts of account', async () => {
    const post = createPostObject('test post', 'test content', [])
    await createPost(app, post, accessToken)
    const response = await getPostsOfAccount(
      app,
      dbAccount.body._id,
      accessToken
    )
    expect(response.status).toEqual(200)
    expect(response.body.length).toEqual(1)
  })
})
