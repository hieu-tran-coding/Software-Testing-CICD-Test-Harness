/**
 * Validate email format using RFC 5322 compatible regex pattern
 * @param {string} email
 * @returns {boolean}
 */
function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate username (alphanumeric, underscores, hyphens, length 3-30)
 * @param {string} username
 * @returns {boolean}
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 30) return false;
  return /^[a-zA-Z0-9_-]+$/.test(trimmed);
}

/**
 * Validate password requirements
 * @param {string} password
 * @param {number} minLength
 * @returns {boolean}
 */
function validatePassword(password, minLength = 6) {
  if (!password || typeof password !== 'string') return false;
  return password.length >= minLength;
}

/**
 * Validate article creation / update inputs
 * @param {object} input
 * @returns {{ isValid: boolean, errors: string[] }}
 */
function validateArticleInput(input = {}) {
  const errors = [];

  if (!input.title || typeof input.title !== 'string' || input.title.trim().length === 0) {
    errors.push("title can't be blank");
  }

  if (!input.description || typeof input.description !== 'string' || input.description.trim().length === 0) {
    errors.push("description can't be blank");
  }

  if (!input.body || typeof input.body !== 'string' || input.body.trim().length === 0) {
    errors.push("body can't be blank");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Strip potential script tags / basic sanitize
 * @param {string} input
 * @returns {string}
 */
function sanitizeString(input) {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}

module.exports = {
  validateEmail,
  validateUsername,
  validatePassword,
  validateArticleInput,
  sanitizeString
};
