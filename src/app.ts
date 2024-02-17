import express, { Express } from 'express'
import cors from 'cors'

const app = express()
app.use(cors())

import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import userPostRoute from './routes/postRoutes'
import authRoute from './routes/authRoutes'
import accountRoute from './routes/accountRoutes'
import commentRoute from './routes/commentRoutes'

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
        app.use('/post', userPostRoute)
        app.use('/comment', commentRoute)
        resolve(app)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export = initApp
