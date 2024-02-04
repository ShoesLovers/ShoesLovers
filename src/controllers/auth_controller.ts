import { Request, Response } from 'express'
import Account from '../models/accountModel'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const register = async (req: Request, res: Response) => {
  console.log('register')
  const { email, password, name } = req.body

  if (!email || !password || !name) {
    return res.status(400).send('missing email or password or name')
  }

  try {
    const existAccount = await Account.findOne({ email })
    if (existAccount) {
      throw res.status(400).send('user already exist')
    }
    const encryptedPassword = await bcrypt.hash(password, 10)
    const newAccount = await Account.create({
      email,
      password: encryptedPassword,
      name,
    })
    return res.status(201).send(newAccount)
  } catch (err) {
    return res.status(400).send(err.message)
  }
}

const login = async (req: Request, res: Response) => {
  console.log('login')
  const { email, password } = req.body

  if (!email || !password) {
    console.log('email or password is null')
    return res.status(400).send('email or password is null')
  }
  try {
    const account = await Account.findOne({ email })
    if (!account) {
      console.log('user is not exists')
      return res.status(400).send('user is not exists')
    }
    // Check if the password correspond to the hashed password.
    const isMatch = await bcrypt.compare(password, account.password)
    if (!isMatch) {
      throw res.status(400).send('invalid password')
    }

    const accessToken = jwt.sign({ _id: account._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    })

    const refreshToken = jwt.sign(
      { _id: account._id },
      process.env.JWT_REFRESH_SECRET
    )

    if (!account.refreshTokens) {
      account.refreshTokens = [refreshToken]
    } else {
      account.refreshTokens.push(refreshToken)
    }
    await account.save()
    return res.status(200).send({
      accessToken,
      refreshToken,
    })
  } catch (err) {
    console.log(err.message)
    return res.status(400).send(err.message)
  }
}

const logout = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization']
  const refreshToken = authHeader && authHeader.split(' ')[1] // Bearer <token>

  if (!refreshToken) return res.sendStatus(401)

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      console.log(err)
      if (err) return res.sendStatus(401)
      try {
        const userDb = await Account.findOne({ _id: user._id })
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = []
          await userDb.save()
          return res.sendStatus(401)
        } else {
          userDb.refreshTokens = userDb.refreshTokens.filter(
            t => t !== refreshToken
          )
          await userDb.save()
          return res.sendStatus(200)
        }
      } catch (err) {
        res.sendStatus(401).send(err.message)
      }
    }
  )
}
const refresh = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization']
  const refreshToken = authHeader && authHeader.split(' ')[1] // Bearer
  if (!refreshToken) return res.sendStatus(401)

  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_SECRET,
    async (err, user: { _id: string }) => {
      if (err) {
        console.log(err)
        return res.sendStatus(404)
      }
      try {
        const userDb = await Account.findOne({ _id: user._id })
        if (
          !userDb.refreshTokens ||
          !userDb.refreshTokens.includes(refreshToken)
        ) {
          userDb.refreshTokens = []
          await userDb.save()
          return res.sendStatus(404)
        }
        const accessToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRATION_TIME }
        )
        const newRefreshToken = jwt.sign(
          { _id: user._id },
          process.env.JWT_REFRESH_SECRET
        )
        userDb.refreshTokens = userDb.refreshTokens.filter(
          t => t !== refreshToken
        )
        userDb.refreshTokens.push(newRefreshToken)
        await userDb.save()
        return res.status(200).send({
          accessToken,
          refreshToken,
        })
      } catch (err) {
        res.sendStatus(404).send(err.message)
      }
    }
  )
}

export default {
  register,
  login,
  logout,
  refresh,
}
