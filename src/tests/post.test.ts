import { Express } from 'express';
import request from 'supertest';
import initApp from '../app';
import mongoose from 'mongoose';
import UserPost, { IPost } from '../models/postModel';
import Account, { IAccount } from '../models/accountModel';
import { registerAccount, loginAccount } from './account.test';

const account: IAccount = {
  email: 'testStudent@post.test.com',
  password: '1234567890',
  name: 'testStudent',
  posts: [],
};
let accessToken = '';
let app: Express;

beforeAll(async () => {
  app = await initApp();
  await UserPost.deleteMany();
  await Account.deleteMany({ email: account.email });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('Tests user Post', () => {
  const register = await registerAccount(account);
  const login = await loginAccount(account);
  accessToken = login.body.accessToken;
  const userId = login.body._id;
  console.log('owner id', login.body._id);
  const post1: IPost = {
    title: 'test1',
    message: 'message1',
    owner: userId,
    comments: [],
  };
  const post2: IPost = {
    title: 'test2',
    message: 'message2',
    owner: userId,
    comments: [],
  };

  const addNewPost = async (post: IPost) => {
    const response = await request(app)
      .post('/userpost')
      .set('Authorization', 'JWT' + accessToken)
      .send(post);
    expect(response.statusCode).toBe(201);
    expect(response.body.owner).toBe(userId);
    expect(response.body.title).toBe(post.title);
    expect(response.body.message).toBe(post.message);
  };

  test('Test get All User posts-empty collection', async () => {
    const response = await request(app).get('/userpost');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual([]);
  });

  test('Test add new post ', async () => {
    addNewPost(post1);
  });

  test('Test get All UsersPosts-one post in db', async () => {
    const response = await request(app).get('/userpost');
    expect(response.statusCode).toBe(200);
    const rc = response.body[0];
    expect(rc.title).toBe(post1.title);
    expect(rc.message).toBe(post1.message);
    expect(rc.owner).toBe(userId);
  });
  test('Test add new user-success ', async () => {
    addNewPost(post2);
  });

  test('Test get All Posts-two Posts', async () => {
    const response = await request(app).get('/userpost');
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(2);
    const rc = response.body[0];
    if (rc.title === post1.title) {
      expect(rc.title).toEqual(post1.title);
      expect(rc.message).toEqual(post1.message);
      expect(rc.owner).toBe(userId);
    } else {
      expect(rc.title).toEqual(post2.title);
      expect(rc.message).toEqual(post2.message);
      expect(rc.owner).toBe(userId);
    }
  });
  test('Test get user by id', async () => {
    const response = await request(app).get('/user/' + userId);
    expect(response.statusCode).toEqual(200);
    const us = response.body;
    expect(us.name).toEqual(account.name);
    expect(us._id).toEqual(userId);
  });
  test('Test get user by id-fail', async () => {
    const response = await request(app).get('/user/' + userId + '1');
    expect(response.statusCode).toEqual(200);
  });
});
