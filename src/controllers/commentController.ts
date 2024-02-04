import { Response } from 'express'
import { commentModel, IComment } from '../models/commentModel'
import { BaseController } from './base_controller'
import accountModel from '../models/accountModel'
import { AuthRequest } from './auth_middleware'
import postModel from '../models/postModel'

class commentController extends BaseController<IComment> {
  constructor() {
    super(commentModel)
  }

  // create a new comment
  async post(req: AuthRequest, res: Response) {
    console.log('Comment Created')
    try {
      const newComment: IComment = {
        writer: req.user._id,
        content: req.body.content,
        postId: req.params.id,
      }

      const comment: IComment = await this.model.create(newComment)
      const commentTemp = await commentModel.findOne({ _id: comment._id })
      console.log(commentTemp)

      const writer = await accountModel.findOne({ _id: req.user._id })
      const post = await postModel.findOne({ _id: req.params.id })
      post.comments.push(comment._id)

      await writer.save()
      await post.save()
      await commentTemp.save()
      res.status(201).send(commentTemp)
    } catch (err) {
      console.log(err)
      res.status(406).send('fail: ' + err.message)
    }
  }

  async deleteById(req: AuthRequest, res: Response) {
    try {
      const comment = await commentModel.findById(req.params.id)

      // Check if the user is the writer of the comment or the owner of the post
      const post = await postModel.findOne({ _id: comment.postId })
      if (
        comment.writer.toString() !== req.user._id.toString() &&
        post.owner.toString() !== req.user._id.toString()
      ) {
        res.status(403).send('Unauthorized')
        return
      }

      // Remove the comment from the post
      post.comments = post.comments.filter(
        id => id.toString() !== comment._id.toString()
      )
      await post.save()

      // Delete the comment
      await commentModel.findByIdAndDelete(req.params.id)
      res.status(200).send('OK')
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
  async updateById(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (req.body.content === '') {
        res.status(406).send('fail: content cannot be empty')
        return
      }

      const comment = await commentModel.findById(req.params.id)
      if (comment.writer.toString() !== req.user._id.toString()) {
        res.status(403).send('Unauthorized')
        return
      }
      await commentModel.findByIdAndUpdate(req.params.id, req.body)
      const obj = await commentModel.findById(req.params.id)
      res.status(200).send(obj)
    } catch (err) {
      res.status(406).send('fail: ' + err.message)
    }
  }
}

export default new commentController()
