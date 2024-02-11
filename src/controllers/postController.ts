import { Request, Response } from 'express'
import PostModel, { IPost } from '../models/postModel'
import { BaseController } from './baseController'
import accountModel from '../models/accountModel'
import { AuthRequest } from './authMiddleware'
import { commentModel } from '../models/commentModel'

class PostController extends BaseController<IPost> {
  constructor() {
    super(PostModel)
  }
  async post(req: AuthRequest, res: Response) {
    console.log('Post Created')
    try {
      // Validation
      const { title, message } = req.body
      if (!title || !message) {
        return res
          .status(406)
          .send('Post not created: Title and message are required.')
      }

      // Create post
      const postDetails: IPost = {
        owner: req.user._id,
        title,
        message,
        comments: [],
      }

      const post = await this.model.create(postDetails)

      // Update owner
      const owner = await accountModel.findOne({ _id: req.user._id })
      if (!owner) {
        return res.status(404).send('Owner not found.')
      }

      owner.posts.push(post._id)
      post.owner = owner._id
      post.comments = []

      // Save changes
      await owner.save()
      await post.save()

      res.status(201).send(post)
    } catch (err) {
      res.status(500).send('Post creation failed: ' + err.message)
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const id = req.params.id
    console.log('getById:' + id)

    try {
      const post = await this.model.findById(id).populate('owner')
      res.status(200).send(post)
    } catch (err) {
      console.log(err.message)
      res.status(500).json({ message: err.message })
    }
  }

  async updateById(req: AuthRequest, res: Response): Promise<void> {
    const id = req.params.id
    console.log('updateById:' + id)
    try {
      const post = await this.model.findById(id)
      const owner = await accountModel.findOne({ _id: req.user._id })
      if (owner._id.toString() !== req.user._id.toString()) {
        throw new Error('Unauthorized')
      }

      post.title = req.body.title
      post.message = req.body.message
      await post.save()
      res.status(200).send(post)
    } catch (err) {
      console.log(err.message)
      res.status(500).send('fail: ' + err.message)
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    const id = req.params.id
    console.log('deleteById:' + id)
    try {
      const post = await this.model.findById(id)

      if (post.comments && post.comments.length > 0) {
        await commentModel.deleteMany({ _id: { $in: post.comments } })
        post.comments = []
      }

      const owner = await accountModel.findOne({ _id: req.user._id })
      if (owner._id.toString() !== req.user._id.toString()) {
        throw new Error('Unauthorized')
      }

      owner.posts = owner.posts.filter(p => p.toString() !== id)
      await owner.save()
      await this.model.findByIdAndDelete(id)
      res.status(200).send('Post deleted')
    } catch (err) {
      console.log(err.message)
      res.status(500).send('fail: ' + err.message)
    }
  }
}

export default new PostController()
