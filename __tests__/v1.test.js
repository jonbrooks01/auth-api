'use strict';

const { app } = require('../src/server.js');
const supertest = require('supertest');
const { db } = require('../src/models');
const mockServer = supertest(app);

// define a user to test
// let testUser;
// let testWriter;
// let testAdmin;
// before all sync up the db and create the user in the db to test against
beforeAll(async () => {
  await db.sync({ force: true });
});
// after all drop the table
afterAll(async () => {
  db.drop({});
});

describe('v1 routes work as expected', () => {
  test('we can create a new user', async () => {
    const response = await mockServer
      .post('/signup')
      .send({ username: 'test', password: '123', role: 'user' });
    console.log(response.body.user);
    expect(response.status).toEqual(201);
  });
  test('we can create a clothes with a valid user', async () => {
    const response = await mockServer.post('/api/v1/clothes').send({
      name: 'Shirt',
      color: 'blue',
      size: 'medium',
    });
    expect(response.status).toBe(201);
  });
  test('we can retrieve the created clothes', async () => {
    const response = await mockServer.get('/api/v1/clothes').send({
      name: 'Shirt',
      color: 'blue',
      size: 'medium',
    });

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test('we can update the created clothes', async () => {
    const response = await mockServer.put('/api/v1/clothes/1').send({
      name: 'dress',
      color: 'blue',
      size: 'medium',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'dress');
  });
  test('we can delete the created clothes', async () => {
    const response = await mockServer.delete('/api/v1/clothes/1');

    expect(response.status).toBe(200);
    expect(response.body).toBe(1);
  });
});
