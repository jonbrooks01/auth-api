'use strict';

const { app } = require('../src/server');
const supertest = require('supertest');
const mockServer = supertest(app);

describe('server routes and functionality', () => {
  test('should respond with a 500 unexpected service error', () => {
    return mockServer.get('/secret').then((results) => {
      expect(results.status).toBe(500);
    });
  });
});
