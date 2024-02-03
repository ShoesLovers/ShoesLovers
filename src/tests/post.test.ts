import { Express } from 'express'
import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import Post, { IPost } from '../models/postModel'
import Account, { IAccount } from '../models/accountModel'

let app: Express
const account: IAccount = {
  email: 'testStudent@post.test.com',
  password: '1234567890',
  name: 'testStudent',
  posts: [],
}

const post1 = {
  title: 'test1',
  message: 'message1',
  comments: [],
}

const post2 = {
  title: 'test2',
  message: 'message2',
  comments: [],
}

const registerAccount = async (account: IAccount) => {
  const response = await request(app).post('/auth/register').send(account)
  return response
}
const loginAccount = async (account: IAccount) => {
  const response = await request(app).post('/auth/login').send(account)
  return response
}

// create post funciton
const createPost = async (post: IPost, accessToken: string) => {
  const response = await request(app)
    .post('/userpost')
    .set('Authorization', `JWT ${accessToken}`)
    .send(post)
  return response
}

afterAll(done => {
  mongoose.connection.close()
  done()
})

describe('Tests user Post', () => {
  let dbAccount: request.Response
  let accessToken: string
  let refreshToken: string
  let login: request.Response
  let post1Response: request.Response
  let post2Response: request.Response

  beforeAll(async () => {
    app = await initApp()
    await Post.deleteMany()
    await Account.deleteMany({ email: account.email })
    // Register account
    dbAccount = await registerAccount(account)
    console.log(dbAccount.body)
    // Login and get access token
    login = await loginAccount(account)

    accessToken = login.body.accessToken
    console.log(accessToken)
    refreshToken = login.body.refreshToken
  })

  test('Test if no posts', async () => {
    const response = await request(app).get('/userpost')
    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  test('Create post', async () => {
    post1Response = await createPost(post1, accessToken)
    post2Response = await createPost(post2, accessToken)

    expect(post1Response.status).toBe(201)
    expect(post2Response.status).toBe(201)
    expect(post1Response.body.title).toBe(post1.title)
    expect(post2Response.body.title).toBe(post2.title)
    expect(post1Response.body.owner).toBe(dbAccount.body._id)
    expect(post2Response.body.owner).toBe(dbAccount.body._id)
    expect(post1Response.body.comments).toEqual([])
    expect(post2Response.body.comments).toEqual([])
    expect(post1Response.body.message).toBe(post1.message)
    expect(post2Response.body.message).toBe(post2.message)
  })

  test('Test get post by id', async () => {
    const response = await request(app)
      .get(`/userpost/${post1Response.body._id}`)
      .set('Authorization', `JWT ${accessToken}`)

    expect(response.status).toBe(200)
    expect(response.body.title).toBe(post1.title)
    expect(response.body.owner._id).toBe(dbAccount.body._id)
    expect(response.body.comments).toEqual([])
    expect(response.body.message).toBe(post1.message)
  })

  test('Test get post by id with invalid id', async () => {
    const response = await request(app)
      .get('/userpost/123')
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.status).toBe(400)
  })

  // test('Test get all posts', async () => {
  //   const response = await request(app).get('/userpost')
  //   expect(response.status).toBe(200)
  //   expect(response.body.length).toBe(2)
  // })

  // test('Test update post', async () => {
  //   const response = await request(app)
  //     .put(`/userpost/${post1Response.body._id}`)
  //     .set('Authorization', `JWT ${accessToken}`)
  //     .send({ title: 'test1 updated', message: 'message1 updated' })
  //   expect(response.status).toBe(200)
  //   expect(response.body.title).toBe('test1 updated')
  //   expect(response.body.message).toBe('message1 updated')
  // })

  // test('Test update post with invalid id', async () => {
  //   const response = await request(app)
  //     .put(`/userpost/123`)
  //     .set('Authorization', `JWT ${accessToken}`)
  //     .send({ title: 'test1 updated', message: 'message1 updated' })
  //   expect(response.status).toBe(400)
  // })

  // test('Test update post with invalid access token', async () => {
  //   const response = await request(app)
  //     .put(`/userpost/${post1Response.body._id}`)
  //     .set('Authorization ', 'JWT 123')
  //     .send({ title: 'test1 updated', message: 'message1 updated' })
  //   expect(response.status).toBe(401)
  // })

  test('Test delete post', async () => {
    const response = await request(app)
      .delete(`/userpost/${post1Response.body._id}`)
      .set('Authorization', `JWT ${accessToken}`)
    expect(response.status).toBe(200)
  })

  // test('Test delete post with invalid id', async () => {
  //   const response = await request(app)
  //     .delete(`/userpost/123`)
  //     .set('Authorization', `JWT ${accessToken}`)
  //   expect(response.status).toBe(400)
  // })

  // test('Test delete post with invalid access token', async () => {
  //   const response = await request(app)
  //     .delete(`/userpost/${post2Response.body._id}`)
  //     .set('Authorization', `JWT 123`)
  //   expect(response.status).toBe(401)
  // })
})
