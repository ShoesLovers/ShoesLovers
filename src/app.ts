import express, { Express } from 'express'
import cors from 'cors'
import logger from 'morgan'
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
import fileRoute from './routes/fileRoutes'
import openaiRoute from './routes/openaiRoute'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'
const initApp = () => {
  const db = mongoose.connection
  db.on('error', error => console.error(error))
  db.once('open', () => console.log('Connected to Database'))
  return new Promise<Express>((resolve, reject) => {
    mongoose
      .connect(process.env.DB_URL, { dbName: 'ShoesLovers' })
      .then(() => {
        // Middlewares
        app.use(logger('dev'))
        app.use(bodyParser.json())
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use((req, res, next) => {
          res.header('Access-Control-Allow-Origin', '*')
          res.header('Access-Control-Allow-Methods', '*')
          res.header('Access-Control-Allow-Headers', '*')
          res.header('Access-Control-Allow-Credentials', 'true')
          next()
        })
        // Routes
        const options = {
          definition: {
            openapi: '3.0.0',
            info: {
              title: 'Social Media Network For Shoes Lovers REST API',
              version: '1.0.0',
              description: 'REST server including authentication using JWT',
            },
            servers: [
              { url: `http://${process.env.DOMAIN_BASE}:${process.env.PORT}` },
            ],
          },
          apis: ['./src/routes/*.ts'],
        }
        const swaggerDocs = swaggerJsDoc(options)
        app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
        app.use('/account', accountRoute)
        app.use('/auth', authRoute)
        app.use('/post', userPostRoute)
        app.use('/comment', commentRoute)
        app.use('/file', fileRoute)
        app.use('/openai', openaiRoute)
        // TEST
        app.use('/public', express.static('public'))
        app.use('/assets', express.static('public/dist_prod/assets'))
        app.use('*', (req, res) => {
          res.sendFile('index.html', { root: 'public/dist_prod' })
        })
        resolve(app)
      })
      .catch(err => {
        reject(err)
      })
  })
}
export = initApp
