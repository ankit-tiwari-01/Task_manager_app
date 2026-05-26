const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/**
 * Middleware to protect API routes with JWT authentication
 */
const protect = async (req, res, next) => {
  let token;

  // Check for JWT token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token and attach to request
      req.user = await User.findByPk(decoded.id, {
        attributes: { exclude: ['password'] }
      });

      if (!req.user) {
        return res.status(401).json({ message: 'User not found, authorization failed' });
      }

      next();
    } catch (error) {
      console.error('JWT Auth Middleware Error:', error);
      return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
