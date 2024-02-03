import { Express } from 'express'
import request from 'supertest'
import initApp from '../app'
import mongoose from 'mongoose'
import UserPost, { IPost } from '../models/postModel'
import Account, { IAccount } from '../models/accountModel'
import { IComment } from '../models/commentModel'

let app: Express
const account: IAccount = {
  email: 'testStudent@post.test.com',
  password: '1234567890',
  name: 'testStudent',
  posts: [],
}
const comment1: IComment = {
  content: 'test comment1',
}
const comment2: IComment = {
  content: 'test comment2',
}
const addNewComment = async (
  comment: IComment,
  postId: mongoose.Schema.Types.ObjectId,
  accessToken: string
) => {
  const response = await request(app)
    .post(`/comment/${postId}`)
    .set('Authorization', `JWT + ${accessToken}`)
    .send({ content: comment })
  return response
}

const registerAccount = async (account: IAccount) => {
  const response = await request(app).post('/auth/register').send(account)
  return response
}
const loginAccount = async (account: IAccount) => {
  const response = await request(app).post('/auth/login').send(account)
  return response
}
afterAll(done => {
  mongoose.connection.close()
  done()
})
describe('Tests user post Comments', () => {
  let accessToken: string
  let userId: mongoose.Schema.Types.ObjectId
  let postId: mongoose.Schema.Types.ObjectId

  beforeAll(async () => {
    app = await initApp()
    await UserPost.deleteMany()
    await Account.deleteMany({})

    const register = await registerAccount(account)
    const login = await loginAccount(account)
    accessToken = login.body.accessToken
    userId = register.body._id
    const post: IPost = {
      title: 'test1',
      message: 'message1',
      owner: userId,
      comments: [],
    }
    const response = await request(app)
      .post('/userpost')
      .set('Authorization', 'JWT' + accessToken)
      .send(post)
    postId = response.body._id
  })

  test('should add new comment', async () => {
    const response = await addNewComment(comment1, postId, accessToken)
    expect(response.status).toBe(201)
    // expect(response.body.comments[0].comment).toBe(comment1)
  })
  // test('should add new comment', async () => {
  //   const response = await addNewComment(comment2, postId, accessToken)
  //   expect(response.status).toBe(201)
  //   expect(response.body.comments[1].comment).toBe(comment2)
  // })
  // test('should not add new empty-comment ', async () => {
  //   const response = await addNewComment({ content: '' }, postId, accessToken)
  //   expect(response.status).toBe(400)
  // })
  // test('should not add new comment', async () => {
  //   const response = await addNewComment(
  //     { content: '     ' },
  //     postId,
  //     accessToken
  //   )
  //   expect(response.status).toBe(400)
  // })
  // test('get all comments', async () => {
  //   const response = await request(app).get(`/userpost/${postId}/comment`)
  //   expect(response.status).toBe(200)
  //   expect(response.body.length).toBe(2)
  // })
  // test('update comment', async () => {
  //   const response = await request(app)
  //     .put(`/userpost/${postId}/comment/${userId}`)
  //     .set('Authorization', 'JWT' + accessToken)
  //     .send({ comment: 'new comment' })
  //   expect(response.status).toBe(200)
  //   expect(response.body.comments[0].comment).toBe('new comment')
  // })
  // test('update empty-comment-fail', async () => {
  //   const response = await request(app)
  //     .put(`/userpost/${postId}/comment/${userId}`)
  //     .set('Authorization', 'JWT' + accessToken)
  //     .send({ comment: '' })
  //   expect(response.status).toBe(400)
  // })
  // test('update comment-fail-empty id', async () => {
  //   const response = await request(app)
  //     .put(`/userpost/${postId}/comment/1`)
  //     .set('Authorization', 'JWT' + accessToken)
  //     .send({ comment: 'jkhl' })
  //   expect(response.status).toBe(400)
  // })
  // test('delete comment', async () => {
  //   const response = await request(app)
  //     .delete(`/comment/${userId}`)
  //     .set('Authorization', 'JWT' + accessToken)
  //   expect(response.status).toBe(200)
  //   expect(response.body.comments.length).toBe(1)
  // })
  // test('delete comment-fail-wrong-id', async () => {
  //   const response = await request(app)
  //     .delete(`/userpost/123/comment/${postId}`)
  //     .set('Authorization', 'JWT' + accessToken)
  //   expect(response.status).toBe(400)
  // })
})
