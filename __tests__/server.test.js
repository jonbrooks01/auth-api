'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const mockServer = supertest(app);
const { db } = require('../src/models/index.js');

beforeEach(async () => {
  db.sync();
});
afterEach(async () => {
  await db.drop({});
});

describe('test the server routes and db', () => {
  test('we can post a new user to /signup', async () => {
    // when we send a req to /signup {password username} via req.body route and get back status: 200 and object: user object made from the model based on the data we sent
    // req.body = user1;
    const res = await mockServer
      .post('/signup')
      .send({ username: 'john', password: '1234', role: 'user' });
    expect(res.status).toBe(201);
  });
});
