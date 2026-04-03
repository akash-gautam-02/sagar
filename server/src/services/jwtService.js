const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'akash_secure_123@jwt';
const ACCESS_EXPIRY = process.env.JWT_EXPIRES_IN || '24h';
const REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

/**
 * Generate Access and Refresh Tokens
 */
const generateTokens = (user) => {
  const payload = {
    uid: user.id,
    email: user.email,
    phone: user.phone,
    role: user.role || 'user'
  };

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_EXPIRY });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_EXPIRY });

  return { accessToken, refreshToken };
};

/**
 * Verify a token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  verifyToken
};
