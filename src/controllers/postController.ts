import UserPostModel, { IPost } from '../models/postModel'
import createController from './base_controller'

const UserPostController = createController<IPost>(UserPostModel)

export default UserPostController
