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
const app_1 = __importDefault(require("../src/app"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../src/models/user_model"));
let app;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    app = yield (0, app_1.default)();
    yield user_model_1.default.deleteMany();
}));
afterAll((done) => {
    mongoose_1.default.connection.close();
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
    test("Test get All Users-empty collection", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(0);
    }));
    const addNewUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user").send(user);
        expect(response.statusCode).toEqual(200);
        expect(response.text).toEqual("OK");
    });
    test("Test add new user-success ", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewUser(user1);
    }));
    test("Test add new user-fail,duplicate id ", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).post("/user").send(user1);
        expect(response.statusCode).toEqual(500);
    }));
    test("Test get All Users-one user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(1);
        const us = response.body[0];
        expect(us.name).toEqual(user1.name);
        expect(us._id).toEqual(user1._id);
    }));
    test("Test add new user-success ", () => __awaiter(void 0, void 0, void 0, function* () {
        addNewUser(user2);
    }));
    test("Test get All Users-two user", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user");
        expect(response.statusCode).toEqual(200);
        const data = response.body;
        expect(data.length).toEqual(2);
        const us = response.body[0];
        if (us._id === user1._id) {
            expect(us.name).toEqual(user1.name);
        }
        else {
            expect(us.name).toEqual(user2.name);
            expect(us._id).toEqual(user2._id);
        }
    }));
    test("Test get user by id", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/" + user1._id);
        expect(response.statusCode).toEqual(200);
        const us = response.body;
        expect(us.name).toEqual(user1.name);
        expect(us._id).toEqual(user1._id);
    }));
    test("Test get user by id-fail", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app).get("/user/" + user1._id + "1");
        expect(response.statusCode).toEqual(200);
    }));
});
//# sourceMappingURL=user.test.js.map