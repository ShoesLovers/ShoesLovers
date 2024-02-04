import { Request, Response } from 'express'
import AccountModel, { IAccount } from '../models/accountModel'
import { BaseController } from './base_controller'
import postModel from '../models/postModel'
import { commentModel } from '../models/commentModel'

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

      if (!account || account.posts.length === 0) {
        return res.status(404).send('No posts found for the specified account.')
      }

      res.status(200).send(account.posts)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const account = await AccountModel.findById(req.params.id)

      if (!account) {
        res.status(404).send('Account not found.')
        return
      }

      // Delete all posts and comments of the account
      if (account.posts && account.posts.length > 0) {
        await commentModel.deleteMany({ postId: { $in: account.posts } })
        await postModel.deleteMany({ _id: { $in: account.posts } })
        account.posts = []
      }

      // Save the account without posts
      await account.save()

      // Delete the account
      await AccountModel.findByIdAndDelete(req.params.id)

      res.send('OK')
    } catch (err) {
      res.status(500).send(err.message)
    }
  }
}

export default new AccountController()
