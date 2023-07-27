'use strict';

require('dotenv').config();
const PORT = process.env.PORT || 3001;
const app = require('./src/server.js');
const { db } = require('./src/auth/models');

db.sync()
  // .drop()
  .then(() => {
    app.listen(PORT, () => console.log('server up'));
  })
  .catch((e) => {
    console.error('Could not start server', e.message);
  });
