import { Request, Response } from 'express'
import AccountModel, { IAccount } from '../models/accountModel'
import { BaseController } from './baseController'
import postModel from '../models/postModel'
import { commentModel } from '../models/commentModel'
import { AuthRequest } from './authMiddleware'
import bcrypt from 'bcrypt'

class AccountController extends BaseController<IAccount> {
  constructor() {
    super(AccountModel)
  }

  async getPostsOfAccount(req: Request, res: Response): Promise<void> {
    console.log('getPostsOfAccount')
    try {
      const account = await AccountModel.findById(req.params.id).populate(
        'posts'
      )

      if (!account || account?.posts.length === 0) {
        res.status(404).send('No posts found for the specified account.')
        return
      }

      res.status(200).send(account.posts)
    } catch (err) {
      console.log(err.message)
      res.status(500).send(err.message)
    }
  }

  async updateById(req: AuthRequest, res: Response): Promise<void> {
    try {
      const account = await AccountModel.findById(req.params.id)

      // Check if the user is authorized to update the account
      if (req.user._id.toString() !== account._id.toString()) {
        res.status(401).send('Unauthorized')
        return
      }

      // Check if the email is already in use
      if (req.body?.email) {
        const accountWithSameEmail = await AccountModel.findOne({
          email: req.body.email,
        })

        if (
          accountWithSameEmail &&
          accountWithSameEmail._id.toString() !== account._id.toString()
        ) {
          res.status(400).send('Email already in use')
          return
        }
        account.email = req.body.email
      }

      if (req.body?.image) {
        account.image = req.body.image
      }

      if (req.body?.name) {
        account.name = req.body.name
      }

      // take the plain password and hash it and put it in the account object
      if (req.body?.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        account.password = hashedPassword
      }

      await account.save()

      res.status(200).send(account)
    } catch (err) {
      res.status(500).send(err.message)
    }
  }

  async deleteById(req: Request, res: Response): Promise<void> {
    try {
      const account = await AccountModel.findById(req.params.id)

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
