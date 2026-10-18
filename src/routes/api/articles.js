const express = require('express');
const router = express.Router();
const ArticleModel = require('../../models/article');
const CommentModel = require('../../models/comment');
const memoryDb = require('../../store/memoryDb');
const { requireAuth, optionalAuth } = require('../../middleware/auth');
const { parsePagination } = require('../../utils/paginate');

/**
 * GET /api/articles - List articles with filtering & pagination
 */
router.get('/articles', optionalAuth, (req, res) => {
  const { limit, offset } = parsePagination(req.query);
  const { tag, author, favorited } = req.query;

  const result = memoryDb.findArticles({ tag, author, favorited, limit, offset });
  const articles = result.articles.map(a => ArticleModel.toArticleResponse(a, req.user).article);

  res.status(200).json({
    articles,
    articlesCount: result.totalCount
  });
});

/**
 * GET /api/articles/feed - Feed of articles by followed authors
 */
router.get('/articles/feed', requireAuth, (req, res) => {
  const { limit, offset } = parsePagination(req.query);

  const result = memoryDb.findFeedArticles(req.user, { limit, offset });
  const articles = result.articles.map(a => ArticleModel.toArticleResponse(a, req.user).article);

  res.status(200).json({
    articles,
    articlesCount: result.totalCount
  });
});

/**
 * POST /api/articles - Create an article
 */
router.post('/articles', requireAuth, (req, res, next) => {
  try {
    const articleData = req.body && req.body.article ? req.body.article : req.body;

    const newArticle = ArticleModel.create(articleData, req.user);
    memoryDb.saveArticle(newArticle);

    res.status(201).json(ArticleModel.toArticleResponse(newArticle, req.user));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/articles/:slug - Get a single article
 */
router.get('/articles/:slug', optionalAuth, (req, res) => {
  const article = memoryDb.findArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ errors: { message: 'Article not found' } });
  }

  res.status(200).json(ArticleModel.toArticleResponse(article, req.user));
});

/**
 * PUT /api/articles/:slug - Update an article (author only)
 */
router.put('/articles/:slug', requireAuth, (req, res, next) => {
  try {
    const article = memoryDb.findArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ errors: { message: 'Article not found' } });
    }

    if (article.author.username !== req.user.username) {
      return res.status(403).json({ errors: { message: 'Forbidden. You are not the author.' } });
    }

    const updates = req.body && req.body.article ? req.body.article : req.body;
    const oldSlug = article.slug;
    const updated = ArticleModel.update(article, updates);

    // If slug changed, update key in memoryDb
    if (updated.slug !== oldSlug) {
      memoryDb.deleteArticle(oldSlug);
    }
    memoryDb.saveArticle(updated);

    res.status(200).json(ArticleModel.toArticleResponse(updated, req.user));
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/articles/:slug - Delete an article (author only)
 */
router.delete('/articles/:slug', requireAuth, (req, res) => {
  const article = memoryDb.findArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ errors: { message: 'Article not found' } });
  }

  if (article.author.username !== req.user.username) {
    return res.status(403).json({ errors: { message: 'Forbidden. You are not the author.' } });
  }

  memoryDb.deleteArticle(article.slug);
  res.status(200).json({ message: 'Article deleted successfully' });
});

/**
 * POST /api/articles/:slug/favorite - Favorite an article
 */
router.post('/articles/:slug/favorite', requireAuth, (req, res) => {
  const article = memoryDb.findArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ errors: { message: 'Article not found' } });
  }

  const updated = memoryDb.favoriteArticle(article.slug, req.user.id || req.user.username);
  res.status(200).json(ArticleModel.toArticleResponse(updated, req.user));
});

/**
 * DELETE /api/articles/:slug/favorite - Unfavorite an article
 */
router.delete('/articles/:slug/favorite', requireAuth, (req, res) => {
  const article = memoryDb.findArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ errors: { message: 'Article not found' } });
  }

  const updated = memoryDb.unfavoriteArticle(article.slug, req.user.id || req.user.username);
  res.status(200).json(ArticleModel.toArticleResponse(updated, req.user));
});

// --- Comments sub-routes ---

/**
 * POST /api/articles/:slug/comments - Add comment to an article
 */
router.post('/articles/:slug/comments', requireAuth, (req, res, next) => {
  try {
    const article = memoryDb.findArticleBySlug(req.params.slug);
    if (!article) {
      return res.status(404).json({ errors: { message: 'Article not found' } });
    }

    const commentData = req.body && req.body.comment ? req.body.comment : req.body;
    const newComment = CommentModel.create(commentData, req.user, article.slug);
    memoryDb.saveComment(newComment);

    res.status(201).json(CommentModel.toCommentResponse(newComment, req.user));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/articles/:slug/comments - Get comments for an article
 */
router.get('/articles/:slug/comments', optionalAuth, (req, res) => {
  const article = memoryDb.findArticleBySlug(req.params.slug);
  if (!article) {
    return res.status(404).json({ errors: { message: 'Article not found' } });
  }

  const comments = memoryDb.findCommentsBySlug(article.slug);
  const formatted = comments.map(c => CommentModel.toCommentResponse(c, req.user).comment);

  res.status(200).json({ comments: formatted });
});

/**
 * DELETE /api/articles/:slug/comments/:id - Delete a comment (author only)
 */
router.delete('/articles/:slug/comments/:id', requireAuth, (req, res) => {
  const comment = memoryDb.findCommentById(req.params.id);
  if (!comment) {
    return res.status(404).json({ errors: { message: 'Comment not found' } });
  }

  if (comment.author.username !== req.user.username) {
    return res.status(403).json({ errors: { message: 'Forbidden. You are not the comment author.' } });
  }

  memoryDb.deleteComment(comment.id);
  res.status(200).json({ message: 'Comment deleted successfully' });
});

module.exports = router;
