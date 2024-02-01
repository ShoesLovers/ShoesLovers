import { Express } from 'express'
import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import AccountModel, { IAccount } from '../models/accountModel'
import bcrypt from 'bcrypt'

let app: Express

beforeAll(async () => {
  app = await initApp()
  console.log('before all')
  await AccountModel.deleteMany()
})

afterAll(done => {
  mongoose.connection.close()
  done()
})

const registerAccount = async (account: IAccount) => {
  const response = await request(app).post('/auth/register').send(account)
  return response
}

describe('Account tests', () => {
  let accessToken: string
  // let refreshToken: string
  const account: IAccount = {
    email: 'test@gmail.com',
    password: '1234',
    name: 'testUser',
    posts: [],
  }

  test('Register test', async () => {
    const response = await registerAccount(account)
    expect(response.body.name).toEqual('testUser')
    expect(response.body.email).toEqual('test@gmail.com')
    expect(response.status).toEqual(201)
  })

  test('Login test', async () => {
    const response = await request(app).post('/auth/login').send(account)
    expect(response.status).toEqual(200)
    accessToken = response.body.accessToken
  })

  test('Test that only one account exist in DB', async () => {
    const response = await request(app)
      .get('/account')
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.body.length).toEqual(1)
    const checkAccount = response.body[0]
    expect(checkAccount.name).toEqual(account.name)
    expect(checkAccount.email).toEqual(account.email)
    expect(await bcrypt.compare(account.password, checkAccount.password))
  })

  test('Test get all accounts-fail', async () => {
    const response = await request(app).get('/account')
    expect(response.status).toEqual(500)
  })

  test('Test add same account', async () => {
    const response = await registerAccount(account)
    expect(response.status).toEqual(400)
  })

  test('Test get account by id', async () => {
    const { _id } = await AccountModel.findOne({
      email: account.email,
    }).select('_id')
    const response = await request(app)
      .get(`/account/${_id}`)
      .set('Authorization', `JWT ${accessToken}`)
      .send({ _id })
    expect(response.status).toEqual(200)
    expect(response.body.name).toEqual(account.name)
    expect(response.body.email).toEqual(account.email)
  })

  test('Test get account by wrong id', async () => {
    const response = await request(app)
      .get(`/account/123`)
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.status).toEqual(500)
  })

  test('Test update account by ID', async () => {
    const { _id } = await AccountModel.findOne({
      email: account.email,
    }).select('_id')

    const response = await request(app)
      .put(`/account/${_id}`)
      .set('Authorization', `JWT ${accessToken}`)
      .send({ name: 'newName', email: 'newEmail@gmail.com' })

    expect(response.status).toEqual(200)
    expect(response.body.name).toEqual('newName')
    expect(response.body.email).toEqual('newEmail@gmail.com')

    account.name = 'newName'
    account.email = 'newEmail@gmail.com'
  })

  test('Test delete account', async () => {
    const newAccount = await registerAccount({
      email: 'newAccount@gmail.com',
      password: '1234',
      name: 'newAccount',
      posts: [],
    })

    const login = await request(app).post('/auth/login').send(newAccount.body)
    const newAccessToken = login.body.accessToken

    const { _id } = await AccountModel.findOne({ email: account.email }).select(
      '_id'
    )

    console.log('IDDDDDD: ' + _id)

    const response = await request(app)
      .delete(`/account/${_id}`)
      .set('Authorization', `JWT ${accessToken}`)

    expect(response.status).toEqual(200)
    expect(response.text).toEqual('OK')
    const onlyOne = (
      await AccountModel.find().set('Authorization', `JWT ${newAccessToken}`)
    ).length
    expect(onlyOne).toEqual(1)
  })

  test('Test delete account with wrong id', async () => {
    const response = await request(app)
      .delete(`/account/123`)
      .set('Authorization', `JWT ${accessToken}`)

    expect(response.status).toEqual(406)
  })
  test('Test add 5 accounts', async () => {
    for (let i = 0; i < 5; i++) {
      await registerAccount({
        email: `test${i}@gmail.com`,
        password: '1234',
        name: `test${i}`,
        posts: [], // test0, test1, test2, test3, test4
      })
    } // 5 accounts
    const response = await request(app)
      .get('/account')
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.body.length).toEqual(6)
  })
})
