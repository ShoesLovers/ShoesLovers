import { Express } from 'express'
import initApp from '../app'
import mongoose from 'mongoose'
import postModel, { IPost } from '../models/postModel'
import { IComment, commentModel } from '../models/commentModel'
import accountModel, { IAccount } from '../models/accountModel'
import request from 'supertest'
import {
  createAccountObject,
  createComment,
  createCommentObject,
  registerAccount,
  loginAccount,
  createPostObject,
  createPost,
} from '../helpers/testsHelpers'

let app: Express
let accessToken: string

const account1: IAccount = createAccountObject('test@gmail.com', '1234', 'test')
const post: IPost = createPostObject('test1', 'message1', [])
const comment: IComment = createCommentObject('Comment')

const registerAndLogin = async (account: IAccount) => {
  // Register Account
  const registerRes = await registerAccount(app, account)
  expect(registerRes.status).toBe(201)

  // Login
  const loginRes = await loginAccount(app, account)
  expect(loginRes.status).toBe(200)

  return loginRes.body.accessToken
}

const createPostAndComment = async (accessToken: string) => {
  // Create Post
  const createPostRes = await createPost(app, post, accessToken)
  expect(createPostRes.status).toBe(201)

  // Create Comment
  await createComment(app, comment, createPostRes.body._id, accessToken)
}

afterAll(async () => {
  await commentModel.deleteMany()
  await postModel.deleteMany()
  await accountModel.deleteMany()
  await mongoose.connection.close()
})

describe('Tests Comments', () => {
  beforeAll(async () => {
    console.log('Before All')
    app = await initApp()

    await commentModel.deleteMany()
    await postModel.deleteMany()
    await accountModel.deleteMany()
  })

  test('Test Register Account, Login, Create Post, and Create Comment on it', async () => {
    try {
      accessToken = await registerAndLogin(account1)
      await createPostAndComment(accessToken)
    } catch (error) {
      console.error(error)
    }
  })

  test('Test Get All Comments', async () => {
    try {
      const response = await request(app).get('/comment')
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
    } catch (error) {
      console.error(error)
    }
  })

  test('Test Get Comment by Id', async () => {
    try {
      const comments = await commentModel.find()
      const response = await request(app).get(`/comment/${comments[0]._id}`)
      expect(response.status).toBe(200)
      expect(response.body.content).toBe(comment.content)
    } catch (error) {
      console.error(error)
    }
  })

  test('Test Get Comment by Invalid Id', async () => {
    try {
      const response = await request(app).get(`/comment/123`)
      expect(response.status).toBe(500)
    } catch (error) {
      console.error(error)
    }
  })

  test('Update Comment with invalid id', async () => {
    try {
      const response = await request(app)
        .put(`/comment/123`)
        .set('Authorization', `JWT ${accessToken}`)
        .send({ content: 'newContent' })
      expect(response.status).toBe(500)
    } catch (error) {
      console.error(error)
    }
  })

  test('Update Comment with empty content', async () => {
    try {
      const comments = await commentModel.find()
      expect(comments.length).toBe(1)
      const response = await request(app)
        .put(`/comment/${comments[0]._id}`)
        .set('Authorization', `JWT ${accessToken}`)
        .send({ content: '' })
      expect(response.status).toBe(406)
    } catch (error) {
      console.error(error)
    }
  })

  test('Update Comment with unauthorized user', async () => {
    try {
      const account2: IAccount = createAccountObject(
        'unauth@gmail.com',
        '1234',
        'unauth'
      )
      const accessToken2 = await registerAndLogin(account2)
      // Try to update comment with unauthorized user
      const comments = await commentModel.find()
      expect(comments.length).toBe(1)
      const response = await request(app)
        .put(`/comment/${comments[0]._id}`)
        .set('Authorization', `JWT ${accessToken2}`)
        .send({ content: 'newContent' })
      expect(response.status).toBe(403)
    } catch (error) {
      console.error(error)
    }
  })

  test('Update Comment', async () => {
    try {
      const comments = await commentModel.find()
      expect(comments.length).toBe(1)
      const response = await request(app)
        .put(`/comment/${comments[0]._id}`)
        .set('Authorization', `JWT ${accessToken}`)
        .send({ content: 'newContent' })
      expect(response.status).toBe(200)
      expect(response.body.content).toBe('newContent')
    } catch (error) {
      console.error(error)
    }
  })

  test('Create Comment with empty content', async () => {
    try {
      const createCommentRes = await createComment(
        app,
        createCommentObject(''),
        post._id,
        accessToken
      )
      expect(createCommentRes.status).toBe(406)
    } catch (error) {
      console.error(error)
    }
  })

  test('Delete comment with unauthorized user', async () => {
    try {
      const account2: IAccount = createAccountObject(
        'test2@gmail.com',
        '1234',
        'test2'
      )
      const accessToken2 = await registerAndLogin(account2)

      const comments = await commentModel.find()
      expect(comments.length).toBe(1)

      const response = await request(app)
        .delete(`/comment/${comments[0]._id}`)
        .set('Authorization', `JWT ${accessToken2}`)
      expect(response.status).toBe(403)
    } catch (error) {
      console.error(error)
    }
  })

  test('Delete comment with invalid id', async () => {
    try {
      const response = await request(app)
        .delete(`/comment/123`)
        .set('Authorization', `JWT ${accessToken}`)
      expect(response.status).toBe(500)
    } catch (error) {
      console.error(error)
    }
  })

  test('Delete Comment', async () => {
    try {
      const comments = await commentModel.find()
      expect(comments.length).toBe(1)

      const response = await request(app)
        .delete(`/comment/${comments[0]._id}`)
        .set('Authorization', `JWT ${accessToken}`)
      expect(response.status).toBe(200)

      const commentsAfter = await commentModel.find()
      expect(commentsAfter.length).toBe(0)
    } catch (error) {
      console.error(error)
    }
  })
})
