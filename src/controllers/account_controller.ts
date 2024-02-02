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
      const account = await AccountModel.findById(req.params.id).populate(
        'posts'
      )
      res.status(200).send(account?.posts)
    } catch (err) {
      res.status(500).json({ message: err.message })
    }
  }
}

export default new AccountController()
