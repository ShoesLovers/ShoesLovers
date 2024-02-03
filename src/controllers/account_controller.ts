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
}

export default new AccountController()
