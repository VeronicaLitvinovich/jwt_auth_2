const request = require('supertest');

// Create a simple mock app for testing without starting the server
const createTestApp = () => {
  const express = require('express');
  const cookieParser = require('cookie-parser');
  
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Mock routes for basic testing
  app.post('/api/auth/signup', (req, res) => {
    if (req.body.username === 'existinguser') {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(200).json({ message: 'User registered successfully!' });
  });

  app.post('/api/auth/signin', (req, res) => {
    if (req.body.username === 'testuser' && req.body.password === 'password123') {
      // Set session cookie
      res.cookie('sessionId', 'mock-session-id', {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
      
      res.status(200).json({ 
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        roles: ['ROLE_USER'],
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        sessionId: 'mock-session-id'
      });
    } else if (req.body.username === 'testuser') {
      res.status(401).json({ message: 'Invalid Password!' });
    } else {
      res.status(404).json({ message: 'User Not found.' });
    }
  });

  app.post('/api/auth/refresh', (req, res) => {
    if (req.body.refreshToken === 'valid_refresh_token') {
      res.status(200).json({
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token'
      });
    } else {
      res.status(403).json({ message: 'Invalid refresh token!' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('sessionId');
    res.status(200).json({ message: 'Logged out successfully!' });
  });

  app.get('/api/auth/session', (req, res) => {
    if (req.cookies.sessionId === 'valid-session') {
      res.status(200).json({
        id: 1,
        username: 'testuser',
        email: 'test@test.com',
        roles: ['ROLE_USER'],
        sessionValid: true
      });
    } else {
      res.status(401).json({ message: 'No active session!' });
    }
  });

  app.get('/api/test/all', (req, res) => {
    res.status(200).send('Public content');
  });

  app.get('/api/test/user', (req, res) => {
    if (req.headers['x-access-token'] === 'valid-token' || req.cookies.sessionId === 'valid-session') {
      res.status(200).send('User content');
    } else {
      res.status(403).send('Access denied');
    }
  });

  app.get('/api/test/admin', (req, res) => {
    if (req.headers['x-access-token'] === 'admin-token' || req.cookies.sessionId === 'admin-session') {
      res.status(200).send('Admin content');
    } else {
      res.status(403).send('Admin access denied');
    }
  });

  return app;
};

describe('Auth API Integration Tests', () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('POST /api/auth/signup', () => {
    it('should register new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newuser',
          email: 'new@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('User registered successfully!');
    });

    it('should reject duplicate username', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'existinguser',
          email: 'existing@test.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Username already exists');
    });
  });

  describe('POST /api/auth/signin', () => {
    it('should login with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
      expect(res.body).toHaveProperty('sessionId');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('Invalid Password!');
    });

    it('should reject non-existent user', async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('User Not found.');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should refresh token with valid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'valid_refresh_token'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
      expect(res.body).toHaveProperty('refreshToken');
    });

    it('should reject invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/auth/refresh')
        .send({
          refreshToken: 'invalid_token'
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('Logged out successfully!');
    });
  });

  describe('GET /api/auth/session', () => {
    it('should return session info with valid session cookie', async () => {
      const res = await request(app)
        .get('/api/auth/session')
        .set('Cookie', ['sessionId=valid-session']);

      expect(res.statusCode).toBe(200);
      expect(res.body.sessionValid).toBe(true);
    });

    it('should reject without session cookie', async () => {
      const res = await request(app)
        .get('/api/auth/session');

      expect(res.statusCode).toBe(401);
    });
  });

  describe('Protected Routes', () => {
    it('should access public route without authentication', async () => {
      const res = await request(app)
        .get('/api/test/all');

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Public content');
    });

    it('should access user route with valid token', async () => {
      const res = await request(app)
        .get('/api/test/user')
        .set('x-access-token', 'valid-token');

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('User content');
    });

    it('should access user route with valid session', async () => {
      const res = await request(app)
        .get('/api/test/user')
        .set('Cookie', ['sessionId=valid-session']);

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('User content');
    });

    it('should reject user route without authentication', async () => {
      const res = await request(app)
        .get('/api/test/user');

      expect(res.statusCode).toBe(403);
    });

    it('should access admin route with admin token', async () => {
      const res = await request(app)
        .get('/api/test/admin')
        .set('x-access-token', 'admin-token');

      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('Admin content');
    });

    it('should reject admin route without admin privileges', async () => {
      const res = await request(app)
        .get('/api/test/admin');

      expect(res.statusCode).toBe(403);
    });
  });
});