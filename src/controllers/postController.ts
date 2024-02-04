import { Request, Response } from 'express'
import PostModel, { IPost } from '../models/postModel'
import { BaseController } from './base_controller'
import accountModel from '../models/accountModel'
import { AuthRequest } from './auth_middleware'

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel)
  }
  async post(req: AuthRequest, res: Response) {
    console.log('Post Created')
    try {
      const newPost: IPost = {
        owner: req.user._id,
        title: req.body.title,
        message: req.body.message,
        comments: [],
      }

      const post = await this.model.create(newPost)
      const owner = await accountModel.findOne({ _id: req.user._id })
      owner.posts.push(post._id)
      post.owner = owner._id
      post.comments = []
      await owner.save()
      await post.save()
      res.status(201).send(post)
    } catch (err) {
      res.status(406).send('fail: ' + err.message)
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    console.log('getById:' + id)

    try {
      const post = await this.model.findById(id).populate('owner')
      res.send(post)
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
    }
  }
}

export default new PostController()
