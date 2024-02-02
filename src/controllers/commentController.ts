import { Request, Response } from 'express';
import { commentModel, IComment } from '../models/commentModel';
import { BaseController } from './base_controller';
import accountModel from '../models/accountModel';
import { AuthRequest } from './auth_middleware';
import mongoose from 'mongoose';
import { AuthReqPost } from './auth_middleware';
type Auth = AuthRequest | AuthReqPost;

class commentController extends BaseController<IComment, Auth> {
  constructor() {
    super(commentModel);
  }
  async post<Auth>(req: Auth, res: Response) {
    console.log('Post Created');
    try {
      const newComment: IComment = {
        content: req.body.content,
        writer: req.user._id as mongoose.Schema.Types.ObjectId,
        postId: req.body.message as mongoose.Schema.Types.ObjectId,
      };
      const comment: any = await this.model.create(newComment);
      const writer = await accountModel.findOne({ _id: req.user._id });
      writer.posts.push(comment._id);
      comment.owner = owner._id;
      await owner.save();
      await comment.save();
      res.status(201).send(comment);
    } catch (err) {
      console.log(err);
      res.status(406).send('fail: ' + err.message);
    }
  }
}

export default new commentController();
