import express, { Express } from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import userPostRoute from './routes/post_route'
import authRoute from './routes/auth_route'
import accountRoute from './routes/account_route'
import commentRoute from './routes/comment_route'

const initApp = () => {
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Database'))
  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, { dbName: 'ShoesLovers' })
      .then(() => {
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use('/account', accountRoute)
        app.use('/auth', authRoute)
        app.use('/userpost', userPostRoute)
        app.use('/comment', commentRoute)
        resolve(app)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export = initApp
