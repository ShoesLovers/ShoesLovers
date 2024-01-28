import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import AccountModel from "../models/account_model";
import { Express } from "express";

let app: Express;
const account = {
  email: "testUser@test.com",
  password: "1234567890",
};
beforeAll(async () => {
  app = await initApp();
  console.log("before all");
  await AccountModel.deleteMany({ email: account.email });
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
let token: string;
describe("Auth tests", () => {
  test(" Register test", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ account });
    expect(response.status).toEqual(201);
  });
  test(" duplicate Register test", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({ account });
    expect(response.status).toEqual(400);
  });

  test("Test Login", async () => {
    const response = await request(app).post("/auth/login").send(account);
    expect(response.statusCode).toBe(200);
    token = response.body.accessToken;
    expect(token).toBeDefined();
  });

  test("Test forbidden access without token", async () => {
    const response = await request(app).get("/student");
    expect(response.statusCode).toBe(401);
  });

  test("Test access with valid token", async () => {
    const response = await request(app)
      .get("/student")
      .set("Authorization", "JWT " + token);
    expect(response.statusCode).toBe(200);
  });

  test("Test access with invalid token", async () => {
    const response = await request(app)
      .get("/student")
      .set("Authorization", "JWT 1" + token);
    expect(response.statusCode).toBe(401);
  });
  // test(" Logout test", async () => {
  //   const response = await request(app).post("/auth/logout").send({
  //     email: "test",
  //     password: "test",
  //   });
  //   expect(response.status).toEqual(200);
  // });
});
