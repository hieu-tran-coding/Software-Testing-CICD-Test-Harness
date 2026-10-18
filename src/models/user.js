const bcrypt = require('bcryptjs');
const { validateEmail, validateUsername, validatePassword } = require('../utils/validator');

class UserModel {
  /**
   * Validate raw user registration data
   * @param {object} data
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validate(data = {}) {
    const errors = [];

    if (!validateUsername(data.username)) {
      errors.push('username must be between 3 and 30 characters and alphanumeric');
    }

    if (!validateEmail(data.email)) {
      errors.push('email is invalid');
    }

    if (!validatePassword(data.password, 6)) {
      errors.push('password must be at least 6 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a user object with hashed password
   * @param {object} data
   * @returns {Promise<object>}
   */
  static async create(data = {}) {
    const validation = this.validate(data);
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(', '));
      err.status = 422;
      err.errors = validation.errors;
      throw err;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    return {
      id: data.id || `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
      passwordHash,
      bio: data.bio || '',
      image: data.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg',
      following: Array.isArray(data.following) ? [...data.following] : [],
      createdAt: data.createdAt || new Date().toISOString()
    };
  }

  /**
   * Compare plain password with stored hash
   * @param {string} plainPassword
   * @param {string} passwordHash
   * @returns {Promise<boolean>}
   */
  static async verifyPassword(plainPassword, passwordHash) {
    if (!plainPassword || !passwordHash) return false;
    return bcrypt.compare(plainPassword, passwordHash);
  }

  /**
   * Format user response according to Conduit API spec
   * @param {object} user
   * @param {string} token
   * @returns {object}
   */
  static toUserResponse(user, token = null) {
    if (!user) return null;
    const response = {
      user: {
        email: user.email,
        username: user.username,
        bio: user.bio || '',
        image: user.image || null
      }
    };
    if (token) {
      response.user.token = token;
    }
    return response;
  }

  /**
   * Format profile response
   * @param {object} user
   * @param {boolean} following
   * @returns {object}
   */
  static toProfileResponse(user, following = false) {
    if (!user) return null;
    return {
      profile: {
        username: user.username,
        bio: user.bio || '',
        image: user.image || null,
        following: Boolean(following)
      }
    };
  }
}

module.exports = UserModel;
