'use strict';

process.env.SECRET = 'TEST_SECRET';

const bearer = require('./bearer');
const { db, users } = require('../../models/index.js');
const jwt = require('jsonwebtoken');

let userInfo = {
  admin: { username: 'admin', password: 'password' },
};

// Pre-load our database with fake users
beforeAll(async () => {
  await db.sync();
  await users.create(userInfo.admin);
});
afterAll(async () => {
  await db.drop();
});

describe('Auth Middleware', () => {
  // Mock the express req/res/next that we need for each middleware call
  const req = {};
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(() => res),
    json: jest.fn(() => res),
  };
  const next = jest.fn();

  describe('user authentication', () => {
    it('logs in a user with a proper token', async () => {
      const token = jwt.sign({ username: 'admin' }, process.env.SECRET);

      req.headers = {
        authorization: `Bearer ${token}`,
      };
      await bearer(req, res, next);

      const user = await users.authenticateToken(token);
      expect(next).toHaveBeenCalledWith();
      expect(req.user).toEqual(user);
      expect(req.token).toBe(token);
    });

    it('fails authentication with an incorrect token', async () => {
      const token = 'invalid_token';

      req.headers = {
        authorization: `Bearer ${token}`,
      };

      users.authenticateToken = jest.fn().mockResolvedValue(null);

      await bearer(req, res, next);

      expect(next).toHaveBeenCalledWith('Invalid Login');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
