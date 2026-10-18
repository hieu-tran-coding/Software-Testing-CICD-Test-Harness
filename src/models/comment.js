const { sanitizeString } = require('../utils/validator');

class CommentModel {
  /**
   * Validate comment input
   * @param {object} data
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validate(data = {}) {
    const errors = [];
    if (!data.body || typeof data.body !== 'string' || data.body.trim().length === 0) {
      errors.push("body can't be blank");
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Create a new comment
   * @param {object} data
   * @param {object} author
   * @param {string} articleSlug
   * @returns {object}
   */
  static create(data = {}, author = {}, articleSlug = '') {
    if (!author || !author.username) {
      const err = new Error('Comment must have an author');
      err.status = 401;
      throw err;
    }

    const validation = this.validate(data);
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(', '));
      err.status = 422;
      err.errors = validation.errors;
      throw err;
    }

    const now = new Date().toISOString();
    return {
      id: data.id || `cmt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      body: sanitizeString(data.body),
      articleSlug,
      authorId: author.id || author.username,
      author: {
        username: author.username,
        bio: author.bio || '',
        image: author.image || null
      },
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Format comment response
   * @param {object} comment
   * @param {object} currentUser
   * @returns {object}
   */
  static toCommentResponse(comment, currentUser = null) {
    if (!comment) return null;

    const isFollowing = currentUser && Array.isArray(currentUser.following)
      ? currentUser.following.includes(comment.author.username)
      : false;

    return {
      comment: {
        id: comment.id,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        body: comment.body,
        author: {
          username: comment.author.username,
          bio: comment.author.bio || '',
          image: comment.author.image || null,
          following: isFollowing
        }
      }
    };
  }
}

module.exports = CommentModel;
