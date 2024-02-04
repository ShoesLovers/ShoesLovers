import { Express } from 'express'
import initApp from '../app'
import mongoose from 'mongoose'
import postModel, { IPost } from '../models/postModel'
import { IComment, commentModel } from '../models/commentModel'
import accountModel, { IAccount } from '../models/accountModel'
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

const account: IAccount = createAccountObject('test@gmail.com', '1234', 'test')
const post: IPost = createPostObject('test1', 'message1', [])
const comment: IComment = createCommentObject('Comment')

afterAll(async () => {
  await mongoose.connection.close()
})

describe('Tests Comments', () => {
  beforeAll(async () => {
    console.log('Before All')
    app = await initApp()
    await accountModel.deleteMany()
    await postModel.deleteMany()
    await commentModel.deleteMany()
  })

  test('Test Register Account, Login, Create Post, and Create Comment on it', async () => {
    try {
      // Register Account
      const registerRes = await registerAccount(app, account)
      expect(registerRes.status).toBe(201)

      // Login
      const loginRes = await loginAccount(app, account)
      expect(loginRes.status).toBe(200)

      const accessToken = loginRes.body.accessToken

      // Create Post
      const createPostRes = await createPost(app, post, accessToken)
      expect(createPostRes.status).toBe(201)

      // Create Comment
      const createCommentRes = await createComment(
        app,
        comment,
        createPostRes.body._id,
        accessToken
      )
      expect(createCommentRes.status).toBe(201)

      // Verify Comment creation
      const comments = await commentModel.find()
      expect(comments.length).toBe(1)
    } catch (error) {
      console.error(error)
    }
  })

  test('Test if there is one comment', async () => {
    const comments = await commentModel.find()
    expect(comments.length).toBe(1)
  })
})
