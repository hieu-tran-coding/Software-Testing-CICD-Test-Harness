const { slugify } = require('../utils/slugify');
const { validateArticleInput, sanitizeString } = require('../utils/validator');

class ArticleModel {
  /**
   * Validate raw article inputs
   * @param {object} data
   * @returns {{ isValid: boolean, errors: string[] }}
   */
  static validate(data = {}) {
    return validateArticleInput(data);
  }

  /**
   * Create an article object
   * @param {object} data - { title, description, body, tagList }
   * @param {object} author - user object
   * @returns {object} article
   */
  static create(data = {}, author = {}) {
    if (!author || !author.username) {
      const err = new Error('Article must have an author');
      err.status = 400;
      throw err;
    }

    const validation = this.validate(data);
    if (!validation.isValid) {
      const err = new Error(validation.errors.join(', '));
      err.status = 422;
      err.errors = validation.errors;
      throw err;
    }

    const uniqueSlug = slugify(data.title, true);
    const now = new Date().toISOString();

    const tagList = Array.isArray(data.tagList)
      ? Array.from(new Set(data.tagList.map(t => String(t).trim().toLowerCase()).filter(Boolean)))
      : [];

    return {
      id: data.id || `art_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      slug: uniqueSlug,
      title: sanitizeString(data.title),
      description: sanitizeString(data.description),
      body: data.body,
      tagList,
      authorId: author.id || author.username,
      author: {
        username: author.username,
        bio: author.bio || '',
        image: author.image || null
      },
      favoritesCount: 0,
      favoritedBy: [],
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Update article fields
   * @param {object} article
   * @param {object} updates
   * @returns {object} updated article
   */
  static update(article, updates = {}) {
    if (!article) throw new Error('Article to update is required');

    const updated = { ...article };

    if (updates.title && typeof updates.title === 'string' && updates.title.trim()) {
      updated.title = sanitizeString(updates.title);
      updated.slug = slugify(updates.title, true);
    }

    if (updates.description && typeof updates.description === 'string') {
      updated.description = sanitizeString(updates.description);
    }

    if (updates.body && typeof updates.body === 'string') {
      updated.body = updates.body;
    }

    if (Array.isArray(updates.tagList)) {
      updated.tagList = Array.from(new Set(updates.tagList.map(t => String(t).trim().toLowerCase()).filter(Boolean)));
    }

    updated.updatedAt = new Date().toISOString();
    return updated;
  }

  /**
   * Format single article response
   * @param {object} article
   * @param {object} currentUser
   * @returns {object}
   */
  static toArticleResponse(article, currentUser = null) {
    if (!article) return null;

    const favorited = currentUser && Array.isArray(article.favoritedBy)
      ? article.favoritedBy.includes(currentUser.id || currentUser.username)
      : false;

    const isFollowing = currentUser && Array.isArray(currentUser.following)
      ? currentUser.following.includes(article.author.username)
      : false;

    return {
      article: {
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList: article.tagList || [],
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited,
        favoritesCount: article.favoritesCount || 0,
        author: {
          username: article.author.username,
          bio: article.author.bio || '',
          image: article.author.image || null,
          following: isFollowing
        }
      }
    };
  }
}

module.exports = ArticleModel;
