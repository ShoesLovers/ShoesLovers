import { Express } from 'express';
import initApp from '../app';
import mongoose from 'mongoose';
import postModel, { IPost } from '../models/postModel';
import { IComment, commentModel } from '../models/commentModel';
import accountModel, { IAccount } from '../models/accountModel';
import {
  createAccountObject,
  createComment,
  createCommentObject,
  registerAccount,
  loginAccount,
  createPostObject,
  createPost,
} from '../helpers/testsHelpers';

let app: Express;

const account: IAccount = createAccountObject(
  'testStudent@post.test.com',
  '1234',
  'testUser'
);
const post: IPost = createPostObject('test1', 'message1', []);
const comment: IComment = createCommentObject('Comment');
const comment2: IComment = createCommentObject('Comment2');

afterAll(async () => {
  await accountModel.deleteMany();
  await postModel.deleteMany();
  await commentModel.deleteMany();
  await mongoose.connection.close();
});

describe('Tests user post Comments', () => {
  beforeAll(async () => {
    console.log('Before All');
    app = await initApp();
    await postModel.deleteMany();
    await accountModel.deleteMany();
  });

  test('Test if no comments', () => {
    registerAccount(app, account).then((res) => {
      if (res.status === 201) {
        loginAccount(app, account).then((res) => {
          if (res.status === 200) {
            createPost(app, post, res.body.accessToken).then((res) => {
              if (res.status === 201) {
                expect(res.body.comments.length).toBe(0);
              }
            });
          }
        });
      }
    });
  });

  test('Test Create new comment', () => {
    loginAccount(app, account).then((res) => {
      if (res.status === 200) {
        createPost(app, post, res.body.accessToken).then((res) => {
          if (res.status === 201) {
            createComment(
              app,
              comment,
              res.body._id,
              res.body.accessToken
            ).then((res) => {
              expect(res.status).toBe(201);
              expect(res.body.content).toBe(comment.content);
            });
            createComment(
              app,
              comment2,
              res.body._id,
              res.body.accessToken
            ).then((res) => {
              expect(res.status).toBe(201);
              expect(res.body.content).toBe(comment2.content);
              expect(res.body.comments.length).toBe(2);
            });
            test('Test get all comments', () => {
              app
                .get(`/comment/${res.body._id}`)
                .set('Authorization', `JWT ${res.body.accessToken}`)
                .send()
                .expect(200)
                .then((res) => {
                  expect(res.body.length).toBe(2);
                });
            });
            test('Test get comment by id', () => {
              app
                .get(`/comment/${comment._id}`)
                .set('Authorization', `JWT ${res.body.accessToken}`)
                .send()
                .expect(200)
                .then((res) => {
                  expect(res.body.content).toBe(comment.content);
                });
            });
          }
        });
      }
    });
  });
});
