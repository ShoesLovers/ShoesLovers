import initApp from './app'

console.log('You are running the server in ' + process.env.NODE_ENV + 'mode')

initApp().then(app => {
  const port = process.env.PORT
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
})
