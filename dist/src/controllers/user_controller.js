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
const user_model_1 = __importDefault(require("../models/user_model"));
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getAllUsers");
    try {
        if (req.query.name) {
            const user = yield user_model_1.default.find({ name: req.query.name });
            res.send(user);
        }
        else {
            const user = yield user_model_1.default.find();
            res.send(user);
        }
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("getUserById:" + req.params.id);
    try {
        const user = yield user_model_1.default.findById(req.params.id);
        res.send(user);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
const postUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("postUser:" + req.body);
    const user = new user_model_1.default(req.body);
    try {
        yield user.save();
        res.send("OK");
    }
    catch (err) {
        console.log(err);
        res.status(500).send("fail: " + err.message);
    }
});
const deleteUser = (req, res) => {
    console.log("deleteUser");
    res.send("Test delete user!");
};
const updateUser = (req, res) => {
    console.log("updateUser");
    res.send("Test update user!");
};
module.exports = {
    getAllUsers,
    getUserById,
    postUser,
    deleteUser,
    updateUser,
};
//# sourceMappingURL=user_controller.js.map