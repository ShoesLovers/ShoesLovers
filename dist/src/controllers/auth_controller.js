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
const account_model_1 = __importDefault(require("../models/account_model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("register");
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password) {
        return res.status(400).send("missing email or password");
    }
    try {
        const existAccount = yield account_model_1.default.findOne({ email: email });
        if (existAccount != null) {
            return res.status(400).send("user already exist");
        }
        const salt = yield bcrypt_1.default.genSalt(10);
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        const newAccount = yield account_model_1.default.create({
            email: email,
            password: encryptedPassword,
        });
        return res.status(201).send({ _id: newAccount._id });
    }
    catch (err) {
        return res.status(400).send("error missing email or password");
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("login");
    const email = req.body.email;
    const password = req.body.password;
    if (email == null || password == null) {
        return res.status(400).send("email or password is null");
    }
    try {
        const account = yield account_model_1.default.findOne({ email: email });
        if (account == null) {
            return res.status(400).send("user already exists");
        }
        const isMatch = yield bcrypt_1.default.compare(password, account.password);
        if (!isMatch) {
            return res.status(400).send("invalid password");
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: account._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });
        return res.status(200).send({ accessToken: accessToken });
    }
    catch (err) {
        return res.status(500).send("server error");
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("logout");
    res.status(400).send("logout");
});
exports.default = { login, logout, register };
//# sourceMappingURL=auth_controller.js.map