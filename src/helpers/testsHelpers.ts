import request from 'supertest'
import { Express } from 'express'
import { IAccount } from '../models/accountModel'
import { IPost } from '../models/postModel'
import { IComment } from '../models/commentModel'

// create an account object builder function //
export const createAccountObject = (
  email: string,
  password: string,
  name: string
) => {
  return {
    email,
    password,
    name,
    posts: [],
  }
}

// Get All Accounts function //
export const getAllAccounts = async (app: Express, accessToken: string) => {
  const response = await request(app)
    .get('/account')
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// Get Account by id function //
export const getAccountById = async (
  app: Express,
  id: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/account/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// Update Account function //
export const updateAccount = async (
  app: Express,
  id: string,
  accessToken: string,
  account: IAccount
) => {
  const response = await request(app)
    .put(`/account/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
    .send(account)
  return response
}

// Delete Account function //
export const deleteAccount = async (
  app: Express,
  id: string,
  accessToken: string
) => {
  const response = await request(app)
    .delete(`/account/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// Get all posts of account function //
export const getPostsOfAccount = async (
  app: Express,
  id: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/account/posts/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// create a post object builder function //
export const createPostObject = (
  title: string,
  message: string,
  comments: string[]
) => {
  return {
    title,
    message,
    comments,
  }
}

// Post object //
export const post: IPost = {
  title: 'test1',
  message: 'message1',
  comments: [],
}

// Register account function //
export const registerAccount = async (app: Express, account: IAccount) => {
  const response = await request(app).post('/auth/register').send(account)
  return response
}

// Login account function //
export const loginAccount = async (app: Express, account: IAccount) => {
  const response = await request(app).post('/auth/login').send(account)
  return response
}

// Logout account function //
export const logoutAccount = async (app: Express, refreshToken: string) => {
  const response = await request(app)
    .post('/auth/logout')
    .set('Authorization', `JWT ${refreshToken}`)
  return response
}

// Get Access Token function //
export const getAccessToken = async (app: Express, refreshToken: string) => {
  const response = await request(app)
    .get('/auth/refresh')
    .set('Authorization', `JWT ${refreshToken}`)
  return response
}

// Create Post function //
export const createPost = async (
  app: Express,
  post: IPost,
  accessToken: string
) => {
  const response = await request(app)
    .post('/post')
    .set('Authorization', `JWT ${accessToken}`)
    .send(post)
  return response
}

// Get Post by id function //
export const getPostById = async (
  app: Express,
  id: string,
  accessToken: string
) => {
  const response = await request(app)
    .get(`/post/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// Get All Posts function //
export const getAllPosts = async (app: Express, accessToken: string) => {
  const response = await request(app)
    .get('/post')
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// Update Post function //
export const updatePost = async (
  app: Express,
  id: string,
  accessToken: string,
  post: IPost
) => {
  const response = await request(app)
    .put(`/post/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
    .send(post)
  return response
}

// Delete Post function //
export const deletePost = async (
  app: Express,
  id: string,
  accessToken: string
) => {
  const response = await request(app)
    .delete(`/post/${id}`)
    .set('Authorization', `JWT ${accessToken}`)
  return response
}

// Create Comment Object function //
export const createCommentObject = (content: string) => {
  return {
    content,
  }
}

// Create Comment function //
export const createComment = async (
  app: Express,
  comment: IComment,
  postId: string,
  accessToken: string
) => {
  const response = await request(app)
    .post(`/comment/${postId}`)
    .set('Authorization', `JWT ${accessToken}`)
    .send(comment)
  return response
}
