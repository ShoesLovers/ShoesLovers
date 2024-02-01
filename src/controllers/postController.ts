import PostModel, { IPost } from '../models/postModel'
import createController from './base_controller'

export default createController<IPost>(PostModel)
