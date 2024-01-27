import UserModel, { IUser } from "../models/user_model";

import BaseController from "./base_controller";

const UserController = new BaseController<IUser>(UserModel);

export default UserController;
