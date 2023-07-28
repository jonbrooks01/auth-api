'use strict';

const server = require('../server');
const supertest = require('supertest');
const mockServer = supertest(server);

describe('server routes and functionality', () => {
  test('should respond with a 500 unexpected service error', () => {
    return mockServer.get('/signin/User').then((results) => {
      expect(results.status).toBe(500);
    });
  });
});
