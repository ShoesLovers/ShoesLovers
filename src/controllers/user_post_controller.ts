import UserPostModel, { IUserPost } from "../models/user_post_model";
import { BaseController } from "./base_controller";
import { Response } from "express";
import { AuthRequest } from "./auth_middleware";

class UserPostController extends BaseController<IUserPost> {
  constructor() {
    super(UserPostModel);
  }

  async post(req: AuthRequest, res: Response) {
    req.body.owner = req.user._id;
    return super.post(req, res);
  }
}

export default new UserPostController();
