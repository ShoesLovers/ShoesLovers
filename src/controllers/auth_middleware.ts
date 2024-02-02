import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import postModel from '../models/postModel'

export interface AuthRequest<T = mongoose.Schema.Types.ObjectId>
  extends Request {
  user: { _id: T }
  post: { _id: T } | null
}

const authMiddleware = <T = mongoose.Schema.Types.ObjectId>(
  req: AuthRequest<T>,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(500).send('No token')
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (req.params.id) {
      const post = await postModel.findById(req.params.id)
      if (!post) return res.sendStatus(404).send('Post not found')
      const id = post._id
      req.post = { _id: id } as { _id: T }
    }
    if (err) {
      console.log(err.message)
      return res.sendStatus(500)
    }
    req.user = user as { _id: T }
    next()
  })
}
export default authMiddleware
