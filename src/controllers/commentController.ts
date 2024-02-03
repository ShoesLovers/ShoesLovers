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

      const comment: any = await this.model.create(newComment)
      const commentTemp = await commentModel
        .findOne({ _id: comment._id })
        .populate('writer')
        .populate('postId')

      const writer = await accountModel.findOne({ _id: req.user._id })
      const post = await postModel.findOne({ _id: req.params.id })
      post.comments.push(comment._id)

      await writer.save()
      await post.save()
      res.status(201).send(commentTemp)
    } catch (err) {
      console.log(err)
      res.status(406).send('fail: ' + err.message)
    }
  }
}

export default new commentController()
