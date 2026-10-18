const { verifyToken } = require('../utils/jwt');
const memoryDb = require('../store/memoryDb');

function extractToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length === 2 && (parts[0] === 'Token' || parts[0] === 'Bearer')) {
    return parts[1];
  }
  return parts[0];
}

/**
 * Middleware requiring authenticated user
 */
function requireAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({
      errors: { message: 'Authentication required. Missing token.' }
    });
  }

  try {
    const decoded = verifyToken(token);
    const user = memoryDb.findUserById(decoded.id) || memoryDb.findUserByEmail(decoded.email);

    if (!user) {
      return res.status(401).json({
        errors: { message: 'User not found or token invalid' }
      });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({
      errors: { message: 'Invalid or expired token', error: err.message }
    });
  }
}

/**
 * Middleware for optional authentication (e.g. public articles list where favorited/following can be evaluated)
 */
function optionalAuth(req, res, next) {
  const token = extractToken(req);

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = verifyToken(token);
    const user = memoryDb.findUserById(decoded.id) || memoryDb.findUserByEmail(decoded.email);
    req.user = user || null;
    req.token = token;
  } catch (err) {
    req.user = null;
  }
  next();
}

module.exports = {
  requireAuth,
  optionalAuth
};
