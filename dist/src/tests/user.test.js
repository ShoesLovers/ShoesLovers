// import request from "supertest";
// import initApp from "../app";
// import mongoose from "mongoose";
// import User from "../models/user_model";
// import { Express } from "express";
// import AccountModel from "../models/account_model";
// let app: Express;
// let accessToken: string;
// const account = {
//   email: "test@test.com",
//   password: "1234567890",
// };
// beforeAll(async () => {
//   app = await initApp();
//   await User.deleteMany();
//   AccountModel.deleteMany({ email: account.email });
//   await request(app).post("/auth/register").send(account);
//   const response = await request(app).post("/auth/login").send(account);
//   accessToken = response.body.accessToken;
// });
// afterAll((done) => {
//   mongoose.connection.close();
//   done();
// });
// interface IUser {
//   name: string;
//   _id: string;
// }
// const user1 = {
//   name: "test1",
//   _id: "12345678901",
// };
// // const user2 = {
// //   name: "test2",
// //   _id: "12345678",
// // };
// describe("Tests User", () => {
//   const addNewUser = async (user: IUser) => {
//     const response = await request(app)
//       .post("/user")
//       .set("Authorization", "JWT " + accessToken)
//       .send(user);
//     expect(response.statusCode).toBe(201);
//   };
//   test("Test get All Users-empty collection", async () => {
//     const response = await request(app)
//       .get("/user")
//       .set("Authorization", "JWT" + accessToken);
//     expect(response.statusCode).toEqual(200);
//     const data = response.body;
//     expect(data.length).toEqual(0);
//   });
//   test("Test add new user-success ", async () => {
//     addNewUser(user1);
//   });
//   test("Test add new user-fail,duplicate id ", async () => {
//     const response = await request(app)
//       .post("/user")
//       .send(user1)
//       .set("Authorization", "JWT" + accessToken);
//     expect(response.statusCode).toEqual(401);
//   });
//   test("Test get All Users-one user", async () => {
//     const response = await request(app)
//       .get("/user")
//       .set("Authorization", "JWT" + accessToken);
//     expect(response.statusCode).toEqual(200);
//     const data = response.body;
//     expect(data.length).toEqual(1);
//     const us = response.body[0];
//     expect(us.name).toEqual(user1.name);
//     expect(us._id).toEqual(user1._id);
//   });
//   // test("Test add new user-success ", async () => {
//   //   addNewUser(user2);
//   // });
//   // test("Test get All Users-two user", async () => {
//   //   const response = await request(app)
//   //     .get("/user")
//   //     .set("Authorization", "JWT" + token);
//   //   expect(response.statusCode).toEqual(200);
//   //   const data = response.body;
//   //   expect(data.length).toEqual(2);
//   //   const us = response.body[0];
//   //   if (us._id === user1._id) {
//   //     expect(us.name).toEqual(user1.name);
//   //   } else {
//   //     expect(us.name).toEqual(user2.name);
//   //     expect(us._id).toEqual(user2._id);
//   //   }
//   // });
//   test("Test get user by id", async () => {
//     const response = await request(app)
//       .get("/user/" + user1._id)
//       .set("Authorization", "JWT" + accessToken);
//     expect(response.statusCode).toEqual(200);
//     const us = response.body;
//     expect(us.name).toEqual(user1.name);
//     expect(us._id).toEqual(user1._id);
//   });
//   test("Test get user by id-fail", async () => {
//     const response = await request(app)
//       .get("/user/" + user1._id + "1")
//       .set("Authorization", "JWT" + accessToken);
//     expect(response.statusCode).toEqual(401);
//   });
//   // test("Test PUT /student/:id", async () => {
//   //   const updateduser = { ...user1, name: "dor" };
//   //   const response = await request(app)
//   //     .put("/student/" + user1._id)
//   //     .set("Authorization", "JWT " + token)
//   //     .send(updateduser);
//   //   expect(response.statusCode).toBe(200);
//   //   expect(response.body.name).toBe(updateduser.name);
//   // });
// });
//# sourceMappingURL=user.test.js.map