const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'realworld-seminar-test-secret-key-2026';
const DEFAULT_EXPIRES_IN = '7d';

/**
 * Generate a JWT token for an authenticated user
 * @param {object} payload - user information (id, username, email)
 * @param {string} expiresIn - token expiry duration
 * @returns {string} signed JWT token
 */
function generateToken(payload, expiresIn = DEFAULT_EXPIRES_IN) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a non-empty object');
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token string
 * @returns {object} decoded token payload
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') {
    throw new Error('Token must be a valid non-empty string');
  }
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  JWT_SECRET,
  generateToken,
  verifyToken
};
