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
const account_model_1 = __importDefault(require("../models/account_model"));
let app;
const account = {
    email: "testUser@test.com",
    password: "1234567890125",
};
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    console.log("before all");
    yield account_model_1.default.deleteMany({ email: account.email });
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
    done();
});
let token;
describe("Auth tests", () => {
    test(" Register test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(account);
        expect(response.status).toEqual(201);
    }));
    test(" duplicate Register test", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/register").send(account);
        expect(response.status).toEqual(400);
    }));
    test("Test Login", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/auth/login").send(account);
        expect(response.statusCode).toBe(200);
        token = response.body.accessToken;
        expect(token).toBeDefined();
    }));
    test("Test forbidden access without token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toBe(401);
    }));
    test("Test access with valid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT " + token);
        expect(response.statusCode).toBe(200);
    }));
    test("Test access with invalid token", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .get("/user")
            .set("Authorization", "JWT" + token + "1");
        expect(response.statusCode).toBe(401);
    }));
    // test(" Logout test", async () => {
    //   const response = await request(app).post("/auth/logout").send({
    //     email: "test",
    //     password: "test",
    //   });
    //   expect(response.status).toEqual(200);
    // });
});
//# sourceMappingURL=auth.test.js.map