import { Request, Response } from 'express'
import { Model } from 'mongoose'
// import { IPost } from '../models/postModel'
import { AuthRequest } from './auth_middleware'
import { IPost } from '../models/postModel'

export class BaseController<ModelType> {
  model: Model<ModelType>
  constructor(model: Model<ModelType>) {
    this.model = model
  }
  async getAll(req: Request, res: Response) {
    console.log('getAllUsers')
    try {
      const users = await this.model.find().select('-_v')
      res.status(200).send(users)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  async getById(req: Request, res: Response) {
    console.log('getUserById:' + req.params.id)
    try {
      const user = await this.model.findById(req.params.id).select('-_v')
      res.send(user)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }

  async post(req: AuthRequest, res: Response) {
    console.log('postUser:' + req.body)
    try {
      const owner = req.user._id
      const newPost: IPost = {
        owner,
        title: req.body.title,
        message: req.body.message,
      }
      const post = await this.model.create(newPost)
      res.status(201).send(post)
    } catch (err) {
      console.log(err)
      res.status(406).send('fail: ' + err.message)
    }
  }

  async updateById(req: Request, res: Response) {
    console.log(`updateAccount: ${req.body}`)
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
