import initApp from './app'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

initApp().then(app => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Social Media Network For Shoes Lovers REST API',
        version: '1.0.0',
        description: 'REST server including authentication using JWT',
      },
      servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./src/routes/*.ts'],
  }

  if (process.env.NODE_ENV.trim() !== 'production') {
    const specs = swaggerJsDoc(options)
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
  }

  console.log('You are running the server in ' + process.env.NODE_ENV + 'mode')

  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`ShoesLovers Web App listening at http://localhost:${port}`)
  })
})
