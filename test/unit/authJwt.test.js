const jwt = require('jsonwebtoken');
const authJwt = require('../../app/middleware/authJwt');

jest.mock('../../app/models', () => ({
  user: {
    findOne: jest.fn()
  },
  Sequelize: {
    Op: {
      gt: jest.fn()
    }
  }
}));

jest.mock('jsonwebtoken');

// Mock auth.config
jest.mock('../../app/config/auth.config', () => ({
  secret: 'test-secret-key'
}));

describe('Auth JWT Middleware Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      cookies: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      clearCookie: jest.fn()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should reject request without token', () => {
      authJwt.verifyToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "No token provided!"
      });
    });

    it('should accept valid token', () => {
      mockReq.headers['x-access-token'] = 'valid-token';
      
      // Mock jwt.verify to call callback with success
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      authJwt.verifyToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBe(1);
    });

    it('should reject invalid token', () => {
      mockReq.headers['x-access-token'] = 'invalid-token';
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'), null);
      });

      authJwt.verifyToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('verifySession', () => {
    it('should reject request without session cookie', async () => {
      await authJwt.verifySession(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.send).toHaveBeenCalledWith({
        message: "No active session!"
      });
    });

    it('should accept valid session', async () => {
      const mockUser = {
        id: 1
      };

      mockReq.cookies = {
        sessionId: 'valid-session-id'
      };

      require('../../app/models').user.findOne.mockResolvedValue(mockUser);

      await authJwt.verifySession(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBe(1);
    });

    it('should reject expired session', async () => {
      mockReq.cookies = {
        sessionId: 'expired-session-id'
      };

      require('../../app/models').user.findOne.mockResolvedValue(null);

      await authJwt.verifySession(mockReq, mockRes, mockNext);

      expect(mockRes.clearCookie).toHaveBeenCalledWith('sessionId');
      expect(mockRes.status).toHaveBeenCalledWith(401);
    });
  });

  describe('verifyHybridToken', () => {
    it('should use session when available', async () => {
      const mockUser = {
        id: 1
      };

      mockReq.cookies = {
        sessionId: 'valid-session-id'
      };

      require('../../app/models').user.findOne.mockResolvedValue(mockUser);

      await authJwt.verifyHybridToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBe(1);
    });

    it('should use token when session is not available', async () => {
      mockReq.headers['x-access-token'] = 'valid-token';
      
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      await authJwt.verifyHybridToken(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.userId).toBe(1);
    });
  });


});