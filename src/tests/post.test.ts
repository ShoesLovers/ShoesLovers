import { Express } from 'express'
import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import Post from '../models/postModel'
import Account from '../models/accountModel'

import {
  registerAccount,
  createAccountObject,
  createPostObject,
  loginAccount,
  createPost,
  getPostById,
  getAllPosts,
  updatePost,
  deletePost,
} from '../helpers/testsHelpers'

afterAll(async () => {
  await Account.deleteMany()
  await Post.deleteMany()
  await mongoose.connection.close()
})

let app: Express
let dbAccount: request.Response
let dbPost: request.Response
let login: request.Response
let accessToken: string

const post = createPostObject('test1', 'message1', [])
const account = createAccountObject('test@gmail.com', '1234', 'test')

describe('Tests Posts', () => {
  beforeAll(async () => {
    app = await initApp()
    await Post.deleteMany()
    await Account.deleteMany({ email: account.email })

    dbAccount = await registerAccount(app, account)
    login = await loginAccount(app, account)
    accessToken = login.body.accessToken
  })

  test('Test if no posts', async () => {
    const response = await getAllPosts(app, accessToken)
    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  test('Create post', async () => {
    dbPost = await createPost(app, post, accessToken)
    expect(dbPost.status).toBe(201)
    expect(dbPost.body.title).toBe(post.title)
    expect(dbPost.body.owner).toBe(dbAccount.body._id)
    expect(dbPost.body.comments).toEqual([])
    expect(dbPost.body.message).toBe(post.message)
  })

  test('Test get post by id', async () => {
    const response = await getPostById(app, dbPost.body._id, accessToken)

    expect(response.status).toBe(200)
    expect(response.body.title).toBe(post.title)
    expect(response.body.owner._id).toBe(dbAccount.body._id)
    expect(response.body.comments).toEqual([])
    expect(response.body.message).toBe(post.message)
  })

  test('Test get post by id without token', async () => {
    const response = await getPostById(app, dbPost.body._id, '')

    expect(response.status).toBe(500)
  })

  test('Test get post by id with invalid token', async () => {
    const response = await getPostById(app, dbPost.body._id, 'invalidtoken')

    expect(response.status).toBe(500)
  })

  test('Test get post by invalid id', async () => {
    const response = await getPostById(app, 'invalidid', accessToken)
    expect(response.status).toBe(500)
  })

  test('Test get all posts', async () => {
    const response = await getAllPosts(app, accessToken)
    expect(response.status).toBe(200)
    expect(response.body.length).toBe(1)
  })

  test('Test get all posts without token', async () => {
    const response = await getAllPosts(app, '')
    expect(response.status).toBe(500)
  })

  test('Test get all posts with invalid token', async () => {
    const response = await getAllPosts(app, 'invalidtoken')
    expect(response.status).toBe(500)
  })

  test('Test update post', async () => {
    const response = await updatePost(app, dbPost.body._id, accessToken, {
      title: 'test1 updated',
      message: 'message1 updated',
      comments: [],
    })
    expect(response.status).toBe(200)
    expect(response.body.title).toBe('test1 updated')
    expect(response.body.message).toBe('message1 updated')
  })

  test('Test delete post', async () => {
    const response = await deletePost(app, dbPost.body._id, accessToken)
    expect(response.status).toBe(200)
  })
})
