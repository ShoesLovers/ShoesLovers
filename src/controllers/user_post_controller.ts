import UserPostModel, { IUserPost } from '../models/user_post_model'
import createController from './base_controller'

const UserPostController = createController<IUserPost>(UserPostModel)

export default UserPostController
