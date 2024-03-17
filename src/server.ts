import initApp from './app';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUI from 'swagger-ui-express';
import http from 'http';
import https from 'https';
import fs from 'fs';

initApp().then((app) => {
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
  };

  if (process.env.NODE_ENV.trim() !== 'production') {
    console.log('development');
    const specs = swaggerJsDoc(options);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));
    http.createServer(app).listen(process.env.PORT);
  } else {
    console.log('production');

    const options2 = {
      key: fs.readFileSync('/client-key.pem'),
      cert: fs.readFileSync('/client-cert.pem'),
    };
    https.createServer(options2, app).listen(process.env.HTTPS_PORT);
  }
});
