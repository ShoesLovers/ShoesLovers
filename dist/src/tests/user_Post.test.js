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
// import UserPost from "../models/user_post_model";
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    // await User.deleteMany();
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
const post1 = {
    title: "test1",
    message: "message1",
    owner: "1234567",
};
const post2 = {
    title: "test2",
    message: "message2",
    owner: "12345678",
};
describe("Tests user Post", () => {
    test("Test get All User posts-empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(0);
    }));
    const addNewPost = (post) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/userpost").send(post);
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual("OK");
    });
    test("Test add new post ", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewPost(post1);
    }));
    test("Test get All UsersPosts-one post in db", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(1);
        const rc = response.body[0];
        expect(rc.title).toEqual(post1.title);
        expect(rc.message).toEqual(post1.message);
        expect(rc.owner).toEqual(post1.owner);
    }));
    test("Test add new user-success ", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewPost(post2);
    }));
    test("Test get All Posts-two Posts", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/userpost");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(2);
        const rc = response.body[0];
        if (rc.title === post1.title) {
            expect(rc.title).toEqual(post1.title);
            expect(rc.message).toEqual(post1.message);
            expect(rc.owner).toEqual(post1.owner);
        }
        else {
            expect(rc.title).toEqual(post2.title);
            expect(rc.message).toEqual(post2.message);
            expect(rc.owner).toEqual(post2.owner);
        }
    }));
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