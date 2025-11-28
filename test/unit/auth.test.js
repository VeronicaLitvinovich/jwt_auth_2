const authController = require('../../app/controllers/auth.controller');

// Mock dependencies
jest.mock('../../app/models', () => ({
  user: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn()
  },
  role: {
    findAll: jest.fn()
  },
  Sequelize: {
    Op: {
      or: jest.fn(),
      gt: jest.fn()
    }
  }
}));

jest.mock('bcryptjs', () => ({
  hashSync: jest.fn(() => 'hashed_password'),
  compareSync: jest.fn(() => true)
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'mock_token'),
  verify: jest.fn()
}));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

// Mock auth.config
jest.mock('../../app/config/auth.config', () => ({
  secret: 'test-secret-key'
}));

describe('Auth Controller Unit Tests', () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      cookie: jest.fn(),
      clearCookie: jest.fn()
    };
    
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should register user successfully', async () => {
      const mockUser = {
        setRoles: jest.fn().mockResolvedValue(true)
      };
      
      const mockRoles = [];
      
      require('../../app/models').user.create.mockResolvedValue(mockUser);
      require('../../app/models').role.findAll.mockResolvedValue(mockRoles);

      mockReq.body = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123'
      };

      // Use process.nextTick to handle Promise resolution
      await new Promise((resolve) => {
        authController.signup(mockReq, mockRes);
        process.nextTick(resolve);
      });

      expect(mockRes.send).toHaveBeenCalledWith({
        message: "User registered successfully!"
      });
    });
  });

  describe('signin', () => {
    it('should return error for non-existent user', async () => {
      require('../../app/models').user.findOne.mockResolvedValue(null);

      mockReq.body = {
        username: 'nonexistent',
        password: 'password123'
      };

      await authController.signin(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.send).toHaveBeenCalledWith({ message: "User Not found." });
    });

  });

  describe('refreshToken', () => {
    it('should reject request without refresh token', async () => {
      mockReq.body = {};

      await authController.refreshToken(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.send).toHaveBeenCalledWith({ 
        message: "Refresh Token is required!" 
      });
    });
  });
});