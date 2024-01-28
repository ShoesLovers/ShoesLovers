import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import UserPost, { IUserPost } from "../models/user_post_model";
import Account, { IAccount } from "../models/account_model";

const account: IAccount = {
  email: "testStudent@test.com",
  password: "1234567890",
};
let token: string;
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

const post1: IUserPost = {
  title: "test1",
  message: "message1",
};
const post2: IUserPost = {
  title: "test2",
  message: "message2",
};

describe("Tests user Post", () => {
  const addNewPost = async (post: IUserPost) => {
    const response = await request(app)
      .post("/userpost")
      .set("Authorization", "JWT" + token)
      .send(post);
    expect(response.statusCode).toEqual(201);
    expect(response.text).toEqual("OK");
  };
  test("Get token", async () => {
    const response = await request(app).post("/auth/register").send(account);
    account._id = response.body._id;
    const response2 = await request(app).post("/auth/login").send(account);
    token = response2.body.accessToken;
    expect(token).toBeDefined();
  });
  test("Test get All User posts-empty collection", async () => {
    const response = await request(app)
      .get("/userpost")
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toStrictEqual([]);
  });

  test("Test add new post ", async () => {
    addNewPost(post1);
  });

  test("Test get All UsersPosts-one post in db", async () => {
    const response = await request(app)
      .get("/userpost")
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    const rc = response.body[0];
    expect(rc.title).toEqual(post1.title);
    expect(rc.message).toEqual(post1.message);
    expect(rc.owner).toBe(account._id);
  });
  test("Test add new user-success ", async () => {
    addNewPost(post2);
  });

  test("Test get All Posts-two Posts", async () => {
    const response = await request(app).get("/userpost");
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(2);
    const rc = response.body[0];
    if (rc.title === post1.title) {
      expect(rc.title).toEqual(post1.title);
      expect(rc.message).toEqual(post1.message);
      expect(rc.owner).toBe(account._id);
    } else {
      expect(rc.title).toEqual(post2.title);
      expect(rc.message).toEqual(post2.message);
      expect(rc.owner).toBe(account._id);
    }
  });

  // test("Test get user by id", async () => {
  //   const response = await request(app).get("/user/" + user1._id);
  //   expect(response.statusCode).toEqual(200);
  //   const us = response.body;
  //   expect(us.name).toEqual(user1.name);
  //   expect(us._id).toEqual(user1._id);
  // });
  // test("Test get user by id-fail", async () => {
  //   const response = await request(app).get("/user/" + user1._id + "1");
  //   expect(response.statusCode).toEqual(200);
  // });
});
