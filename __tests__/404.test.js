'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const mockServer = supertest(app);

describe('server routes and functionality', () => {
  test('it should respond with a 404 on an invalid route', () => {
    return mockServer.get('/mordor').then((results) => {
      expect(results.status).toBe(404);
    });
  });
});
