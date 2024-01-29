"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
const account_model_1 = __importDefault(require("../models/account_model"));
const account = {
    email: "testStudent@post.test.com",
    password: "1234567890",
};
let accessToken = "";
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield user_post_model_1.default.deleteMany();
    yield account_model_1.default.deleteMany({ email: account.email });
    const response = yield (0, supertest_1.default)(app).post("/auth/register").send(account);
    account._id = response.body._id;
    const response2 = yield (0, supertest_1.default)(app).post("/auth/login").send(account);
    accessToken = response2.body.accessToken;
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
const post1 = {
    title: "test1",
    message: "message1",
    owner: "1234567890",
};
const post2 = {
    title: "test2",
    message: "message2",
    owner: "12345678901",
};
describe("Tests user Post", () => {
    const addNewPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post("/userpost")
            .set("Authorization", "JWT" + accessToken)
            .send(post);
        expect(response.statusCode).toBe(201);
        expect(response.body.owner).toBe(account._id);
        expect(response.body.title).toBe(post.title);
        expect(response.body.message).toBe(post.message);
    });
    // test("Get token", async () => {
    //   const response = await request(app).post("/auth/register").send(account);
    //   account._id = response.body._id;
    //   const response2 = await request(app).post("/auth/login").send(account);
    //   accessToken = response2.body.accessToken;
    //   expect(accessToken).toBeDefined();
    // });
    test("Test get All User posts-empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toEqual(200);
        expect(response.body).toStrictEqual([]);
    }));
    test("Test add new post ", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewPost(post1);
    }));
    test("Test get All UsersPosts-one post in db", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toBe(200);
        const rc = response.body[0];
        expect(rc.title).toBe(post1.title);
        expect(rc.message).toBe(post1.message);
        expect(rc.owner).toBe(account._id);
    }));
    test("Test add new user-success ", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewPost(post2);
    }));
    // test("Test get All Posts-two Posts", async () => {
    //   const response = await request(app).get("/userpost");
    //   expect(response.statusCode).toEqual(200);
    //   const data = response.body;
    //   expect(data.length).toEqual(2);
    //   const rc = response.body[0];
    //   if (rc.title === post1.title) {
    //     expect(rc.title).toEqual(post1.title);
    //     expect(rc.message).toEqual(post1.message);
    //     expect(rc.owner).toBe(account._id);
    //   } else {
    //     expect(rc.title).toEqual(post2.title);
    //     expect(rc.message).toEqual(post2.message);
    //     expect(rc.owner).toBe(account._id);
    //   }
    // });
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
//# sourceMappingURL=user_Post.test.js.map