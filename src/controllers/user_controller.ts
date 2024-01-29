import UserModel, { IUser } from "../models/user_model";

import createController from "./base_controller";

const UserController = createController<IUser>(UserModel);

export default UserController;
