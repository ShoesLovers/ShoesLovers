import jwt from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

export interface AuthRequest extends Request {
  user: { _id: mongoose.Schema.Types.ObjectId }
}

const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  console.log('test')
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(500)
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err.message)
      return res.sendStatus(500)
    }
    req.user = user as { _id: mongoose.Schema.Types.ObjectId }
    next()
  })
}
export default authMiddleware
