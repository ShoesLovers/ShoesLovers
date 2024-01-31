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
    console.log('register');
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
        return res.status(400).send('missing email or password or name');
    }
    try {
        const existAccount = yield account_model_1.default.findOne({ email });
        if (existAccount) {
            return res.status(400).send('user already exist');
        }
        const encryptedPassword = yield bcrypt_1.default.hash(password, 10);
        const newAccount = yield account_model_1.default.create({
            email,
            password: encryptedPassword,
            name,
        });
        console.log(newAccount);
        return res.status(201).send(newAccount);
    }
    catch (err) {
        return res.status(400).send('error missing email or password');
    }
});
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send('email or password is null');
    }
    try {
        const account = yield account_model_1.default.findOne({ email });
        console.log(email, password, account.password);
        if (!account) {
            return res.status(400).send('user is not exists');
        }
        // Check if the password correspond to the hashed password.
        const isMatch = yield bcrypt_1.default.compare(password, account.password);
        if (!isMatch) {
            return res.status(400).send('invalid password');
        }
        const accessToken = jsonwebtoken_1.default.sign({ _id: account._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION_TIME,
        });
        const refreshToken = jsonwebtoken_1.default.sign({ _id: account._id }, process.env.JWT_REFRESH_SECRET);
        if (!account.refreshTokens) {
            account.refreshTokens = [refreshToken];
        }
        else {
            account.refreshTokens.push(refreshToken);
        }
        yield account.save();
        return res.status(200).send({
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        return res.status(400).send('error missing email or password');
    }
});
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (!refreshToken)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        console.log(err);
        if (err)
            return res.sendStatus(401);
        try {
            const userDb = yield account_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            else {
                userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
                yield userDb.save();
                return res.sendStatus(200);
            }
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['authorization'];
    const refreshToken = authHeader && authHeader.split(' ')[1]; // Bearer <token>
    if (refreshToken == null)
        return res.sendStatus(401);
    jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return res.sendStatus(401);
        }
        try {
            const userDb = yield account_model_1.default.findOne({ _id: user._id });
            if (!userDb.refreshTokens ||
                !userDb.refreshTokens.includes(refreshToken)) {
                userDb.refreshTokens = [];
                yield userDb.save();
                return res.sendStatus(401);
            }
            const accessToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
            const newRefreshToken = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_REFRESH_SECRET);
            userDb.refreshTokens = userDb.refreshTokens.filter(t => t !== refreshToken);
            userDb.refreshTokens.push(newRefreshToken);
            yield userDb.save();
            return res.status(200).send({
                accessToken,
                refreshToken,
            });
        }
        catch (err) {
            res.sendStatus(401).send(err.message);
        }
    }));
});
exports.default = {
    register,
    login,
    logout,
    refresh,
};
//# sourceMappingURL=auth_controller.js.map