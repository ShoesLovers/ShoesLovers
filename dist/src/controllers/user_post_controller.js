"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_post_model_1 = __importDefault(require("../models/user_post_model"));
const base_controller_1 = __importDefault(require("./base_controller"));
// import { Response } from 'express'
// import { AuthRequest } from './auth_middleware'
// class UserPostController extends BaseController<IUserPost> {
//   constructor() {
//     super(UserPostModel)
//   }
//   async post(req: AuthRequest, res: Response) {
//     req.body.owner = req.user._id
//     return super.post(req, res)
//   }
// }
const UserPostController = (0, base_controller_1.default)(user_post_model_1.default);
exports.default = UserPostController;
//# sourceMappingURL=user_post_controller.js.map