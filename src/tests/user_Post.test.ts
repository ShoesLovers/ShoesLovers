import { Express } from "express";
import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
// import UserPost from "../models/user_post_model";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  // await User.deleteMany();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

interface IUserPost {
  title: string;
  message: string;
  owner: string;
}
const post1: IUserPost = {
  title: "test1",
  message: "message1",
  owner: "1234567",
};
const post2: IUserPost = {
  title: "test2",
  message: "message2",
  owner: "12345678",
};

describe("Tests user Post", () => {
  test("Test get All User posts-empty collection", async () => {
    const response = await request(app).get("/userpost");
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(0);
  });
  const addNewPost = async (post: IUserPost) => {
    const response = await request(app).post("/userpost").send(post);
    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("OK");
  };

  test("Test add new post ", async () => {
    addNewPost(post1);
  });

  test("Test get All UsersPosts-one post in db", async () => {
    const response = await request(app).get("/userpost");
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(1);
    const rc = response.body[0];
    expect(rc.title).toEqual(post1.title);
    expect(rc.message).toEqual(post1.message);
    expect(rc.owner).toEqual(post1.owner);
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
      expect(rc.owner).toEqual(post1.owner);
    } else {
      expect(rc.title).toEqual(post2.title);
      expect(rc.message).toEqual(post2.message);
      expect(rc.owner).toEqual(post2.owner);
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
