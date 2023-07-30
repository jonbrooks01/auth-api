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

describe('v2 routes work as expected', () => {
  test('we can create a new user', async () => {
    const response = await mockServer
      .post('/signup')
      .send({ username: 'test', password: '123', role: 'admin' });
    console.log(response.body.user);
    expect(response.status).toEqual(201);
  });
  test('we can create a food with a valid user', async () => {
    const response = await mockServer
      .post('/api/v2/food')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2OTA2NTM5MTl9.msD3ZaoqvJGZAhclfZLQ8QaTV6rZT_9e5mj_9IpyiME'
      )
      .send({
        name: ' pickle',
        calories: '5',
        type: 'vegetable',
      });
    expect(response.status).toBe(201);
  });
  test('we can retrieve the created food', async () => {
    const response = await mockServer
      .get('/api/v2/food')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2OTA2NTM5MTl9.msD3ZaoqvJGZAhclfZLQ8QaTV6rZT_9e5mj_9IpyiME'
      )
      .send({
        name: ' pickle',
        calories: '5',
        type: 'vegetable',
      });
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
  test('we can update the created food', async () => {
    const response = await mockServer
      .put('/api/v2/food/1')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2OTA2NTM5MTl9.msD3ZaoqvJGZAhclfZLQ8QaTV6rZT_9e5mj_9IpyiME'
      )
      .send({
        name: 'pickled cucumber',
        calories: '46',
        type: 'vegetable',
      });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'pickled cucumber');
  });
  test('we can delete the created food', async () => {
    const response = await mockServer
      .delete('/api/v2/food/1')
      .set(
        'Authorization',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2OTA2NTM5MTl9.msD3ZaoqvJGZAhclfZLQ8QaTV6rZT_9e5mj_9IpyiME'
      );
    expect(response.status).toBe(200);
    expect(response.body).toBe(1);
  });
});
