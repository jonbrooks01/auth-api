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
beforeAll(() => {
  db.sync();
});
// after all drop the table
afterAll(async () => {
  db.drop({});
});

// write some tests based on the mock user
// /read /create /update /delete
// testWrite = read/create
describe('ACL Integration', () => {
  test('we can create a new user', async () => {
    const response = await mockServer
      .post('/signup')
      .send({ username: 'test', password: '123', role: 'admin' });
    expect(response.status).toEqual(201);
  });
  test('we can sign in as our user', async () => {
    const response = await mockServer.post('/signin').auth('test', '123');
    expect(response.status).toBe(200);
    console.log(response.body.user);
    expect(response.body.user.username).toBe('test');
  });
  test('we can make a request to /users', async () => {
    const response = await mockServer
      .get('/users')
      .set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpYXQiOjE2OTA2NTM1ODh9.uC7mAoJ5rMmDIPTuV5fre0fHtqadCEfN2G36KBaygmA'
      );
    expect(response.status).toBe(200);
  });
  //   test('the user should not be able to access the delete route', async () => {
  //     let response = await mockServer
  //       .delete('/delete')
  //       .set('Authorization', `Bearer ${testUser.token}`);
  //     expect(response.status).toBe(500);

  //     // basic can set the header with the .auth property in supertest
  //     // for bearer we have to use .set('Authorization', `Bearer ${testWriter.token}`)
  //     // console.log(testWriter.token);
  //   });
});
