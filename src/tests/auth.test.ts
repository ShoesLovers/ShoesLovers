import request from "supertest";
import initApp from "../app";
import mongoose from "mongoose";
import AccountModel from "../models/account_model";
import { Express } from "express";

let app: Express;
beforeAll(async () => {
  app = await initApp();
  console.log("before all");
  await AccountModel.deleteMany();
});

afterAll((done) => {
  mongoose.connection.close();
  done();
});
describe("Auth", () => {
  test(" Register test", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
      password: "1234567890",
    });
    expect(response.status).toEqual(200);
  });
  test(" duplicate Register test", async () => {
    const response = await request(app).post("/auth/register").send({
      email: "test@test.com",
      password: "1234567890",
    });
    expect(response.status).toEqual(400);
  });

  test(" Login test", async () => {
    const response = await request(app).post("/auth/login").send({
      email: "test@test.com",
      password: "1234567890",
    });
    expect(response.status).toEqual(200);
    const token = response.body.token;
    expect(token).not.toBeNull();
    const response2 = await request(app)
      .get("/users")
      .set("Authorization", "JWT" + token);
    expect(response2.status).toEqual(200);
    const response3 = await request(app)
      .get("/users")
      .set("Authorization", "JWT 1" + token);
    expect(response3.status).toEqual(401);
  });
  test(" Logout test", async () => {
    const response = await request(app).post("/auth/logout").send({
      email: "test",
      password: "test",
    });
    expect(response.status).toEqual(200);
  });
});
