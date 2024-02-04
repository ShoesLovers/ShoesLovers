import { Request, Response } from 'express'
import AccountModel, { IAccount } from '../models/accountModel'
import { BaseController } from './base_controller'

class AccountController extends BaseController<IAccount> {
  constructor() {
    super(AccountModel)
  }
  async getPostsOfAccount(req: Request, res: Response) {
    console.log('getPostsOfAccount')
    try {
      const account = await AccountModel.findById(req.params.id)
      if (account.posts.length === 0) {
        throw res.status(404).send('No posts found')
      } else {
        account.populate('posts')
        res.status(200).send(account.posts)
      }
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const account = await AccountModel.findById(req.params.id)
      if (account.posts) {
        for (const postId of account.posts) {
          await this.model.findByIdAndDelete(postId)
        }
        account.posts = []
      }
      await account.save()
      await this.model.findByIdAndDelete(req.params.id)
      res.send('OK')
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default new AccountController()
