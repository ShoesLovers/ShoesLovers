import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import User from "../models/user_model";
import AccountModel from "../models/account_model";
import { Express } from "express";

let app: Express;
let token: string;
beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
  await AccountModel.deleteMany();
  await request(app).post("/auth/register").send({
    email: "test@test.com",
    password: "1234567890",
  });
  const response = await request(app).post("/auth/login").send({
    email: "test@test.com",
    password: "1234567890",
  });
  token = response.body.accessToken;
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe("Tests User", () => {
  const user1 = {
    name: "test1",
    _id: "1234567",
  };
  const user2 = {
    name: "test2",
    _id: "12345678",
  };
  test("Test get All Users-empty collection", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(0);
  });
  const addNewUser = async (user) => {
    const response = await request(app)
      .post("/user")
      .send(user)
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
    expect(response.text).toEqual("OK");
  };

  test("Test add new user-success ", async () => {
    addNewUser(user1);
  });
  test("Test add new user-fail,duplicate id ", async () => {
    const response = await request(app)
      .post("/user")
      .send(user1)
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(500);
  });
  test("Test get All Users-one user", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(1);
    const us = response.body[0];
    expect(us.name).toEqual(user1.name);
    expect(us._id).toEqual(user1._id);
  });
  test("Test add new user-success ", async () => {
    addNewUser(user2);
  });
  test("Test get All Users-two user", async () => {
    const response = await request(app)
      .get("/user")
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
    const data = response.body;
    expect(data.length).toEqual(2);
    const us = response.body[0];
    if (us._id === user1._id) {
      expect(us.name).toEqual(user1.name);
    } else {
      expect(us.name).toEqual(user2.name);
      expect(us._id).toEqual(user2._id);
    }
  });
  test("Test get user by id", async () => {
    const response = await request(app)
      .get("/user/" + user1._id)
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
    const us = response.body;
    expect(us.name).toEqual(user1.name);
    expect(us._id).toEqual(user1._id);
  });
  test("Test get user by id-fail", async () => {
    const response = await request(app)
      .get("/user/" + user1._id + "1")
      .set("Authorization", "JWT" + token);
    expect(response.statusCode).toEqual(200);
  });
});
