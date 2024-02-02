import { Request, Response } from 'express'
import mongoose, { Model } from 'mongoose'
import { AuthRequest } from './auth_middleware'
import { IPost } from '../models/postModel'
import accountModel from '../models/accountModel'

export class BaseController<ModelType> {
  model: Model<ModelType>
  constructor(model: Model<ModelType>) {
    this.model = model
  }
  async getAll(req: Request, res: Response) {
    console.log('getAll')
    try {
      const users = await this.model.find()?.populate('posts')
      res.status(200).send(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  async getById(req: Request, res: Response) {
    console.log('getById:' + req.params.id)
    try {
      const user = await this.model.findById(req.params.id).populate('posts')

      res.send(user)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  async post(req: AuthRequest, res: Response) {
    console.log(`Post title: ${req.body.title}.`)
    console.log(`Post message: ${req.body.message}.`)

    try {
      const newPost: IPost = {
        owner: req.user._id as mongoose.Schema.Types.ObjectId,
        title: req.body.title,
        message: req.body.message,
      }
      const post: any = await this.model.create(newPost)
      const owner = await accountModel.findOne({ _id: req.user._id })
      owner.posts.push(post._id)
      await owner.save()
      res.status(201).send(post)
    } catch (err) {
      console.log(err)
      res.status(406).send('fail: ' + err.message)
    }
  }

  async updateById(req: Request, res: Response) {
    console.log(`Update: ${req.body}`)
    try {
      await this.model.findByIdAndUpdate(req.params.id, req.body)
      const obj = await this.model.findById(req.params.id)
      res.status(200).send(obj)
    } catch (err) {
      console.log(err)
      res.status(406).send('fail: ' + err.message)
    }
  }
  async deleteById(req: Request, res: Response) {
    console.log('deleteById:' + req.body)
    try {
      await this.model.findByIdAndDelete(req.params.id)
      res.status(200).send('OK')
    } catch (err) {
      console.log(err.message)
      res.status(406).send('fail: ' + err.message)
    }
  }
}
const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseController<ModelType>(model)
}
export default createController
