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
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token || !authHeader) {
      return res.sendStatus(500).send('No token or header found')
    }

    jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
      if (err) {
        console.log('Error in authMiddleware verify' + err.message)
        return res.sendStatus(500)
      }
      req.user = user as { _id: mongoose.Schema.Types.ObjectId }
      next()
    })
  } catch (err) {
    console.log('error in catch block' + err.message)
    return res.sendStatus(500)
  }
}

export default authMiddleware
