class MemoryDb {
  constructor() {
    this.reset();
  }

  reset() {
    this.users = new Map(); // id -> user
    this.articles = new Map(); // slug -> article
    this.comments = new Map(); // id -> comment
  }

  // --- User Operations ---

  saveUser(user) {
    this.users.set(user.id, { ...user });
    return this.users.get(user.id);
  }

  findUserById(id) {
    return this.users.get(id) || null;
  }

  findUserByEmail(email) {
    if (!email) return null;
    const lower = email.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === lower) return user;
    }
    return null;
  }

  findUserByUsername(username) {
    if (!username) return null;
    const lower = username.trim().toLowerCase();
    for (const user of this.users.values()) {
      if (user.username.toLowerCase() === lower) return user;
    }
    return null;
  }

  updateUser(id, updates = {}) {
    const user = this.findUserById(id);
    if (!user) return null;
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  followUser(followerUsername, targetUsername) {
    const follower = this.findUserByUsername(followerUsername);
    const target = this.findUserByUsername(targetUsername);
    if (!follower || !target) return false;

    if (!follower.following.includes(target.username)) {
      follower.following.push(target.username);
      this.saveUser(follower);
    }
    return true;
  }

  unfollowUser(followerUsername, targetUsername) {
    const follower = this.findUserByUsername(followerUsername);
    if (!follower) return false;

    follower.following = follower.following.filter(u => u !== targetUsername);
    this.saveUser(follower);
    return true;
  }

  // --- Article Operations ---

  saveArticle(article) {
    this.articles.set(article.slug, { ...article });
    return this.articles.get(article.slug);
  }

  findArticleBySlug(slug) {
    if (!slug) return null;
    return this.articles.get(slug) || null;
  }

  deleteArticle(slug) {
    const existed = this.articles.has(slug);
    this.articles.delete(slug);

    // Also remove comments associated with this article
    for (const [id, comment] of this.comments.entries()) {
      if (comment.articleSlug === slug) {
        this.comments.delete(id);
      }
    }
    return existed;
  }

  findArticles({ tag, author, favorited, limit = 20, offset = 0 } = {}) {
    let list = Array.from(this.articles.values());

    if (tag) {
      const lowerTag = tag.toLowerCase();
      list = list.filter(a => a.tagList && a.tagList.includes(lowerTag));
    }

    if (author) {
      const lowerAuthor = author.toLowerCase();
      list = list.filter(a => a.author && a.author.username.toLowerCase() === lowerAuthor);
    }

    if (favorited) {
      const favUser = this.findUserByUsername(favorited);
      if (favUser) {
        list = list.filter(a => a.favoritedBy && a.favoritedBy.includes(favUser.id || favUser.username));
      } else {
        list = [];
      }
    }

    // Sort descending by createdAt
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalCount = list.length;
    const paginated = list.slice(offset, offset + limit);

    return {
      articles: paginated,
      totalCount
    };
  }

  findFeedArticles(currentUser, { limit = 20, offset = 0 } = {}) {
    if (!currentUser || !Array.isArray(currentUser.following) || currentUser.following.length === 0) {
      return { articles: [], totalCount: 0 };
    }

    let list = Array.from(this.articles.values()).filter(a =>
      currentUser.following.includes(a.author.username)
    );

    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalCount = list.length;
    const paginated = list.slice(offset, offset + limit);

    return {
      articles: paginated,
      totalCount
    };
  }

  favoriteArticle(slug, userId) {
    const article = this.findArticleBySlug(slug);
    if (!article) return null;

    if (!article.favoritedBy.includes(userId)) {
      article.favoritedBy.push(userId);
      article.favoritesCount = article.favoritedBy.length;
      this.saveArticle(article);
    }
    return article;
  }

  unfavoriteArticle(slug, userId) {
    const article = this.findArticleBySlug(slug);
    if (!article) return null;

    article.favoritedBy = article.favoritedBy.filter(id => id !== userId);
    article.favoritesCount = article.favoritedBy.length;
    this.saveArticle(article);
    return article;
  }

  getAllTags() {
    const tagsSet = new Set();
    for (const article of this.articles.values()) {
      if (Array.isArray(article.tagList)) {
        article.tagList.forEach(t => tagsSet.add(t));
      }
    }
    return Array.from(tagsSet);
  }

  // --- Comment Operations ---

  saveComment(comment) {
    this.comments.set(comment.id, { ...comment });
    return this.comments.get(comment.id);
  }

  findCommentById(id) {
    return this.comments.get(id) || null;
  }

  findCommentsBySlug(slug) {
    const list = [];
    for (const comment of this.comments.values()) {
      if (comment.articleSlug === slug) {
        list.push(comment);
      }
    }
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }

  deleteComment(id) {
    return this.comments.delete(id);
  }
}

// Singleton database instance
const memoryDb = new MemoryDb();

module.exports = memoryDb;
