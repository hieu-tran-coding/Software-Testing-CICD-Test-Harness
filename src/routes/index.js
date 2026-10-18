const express = require('express');
const router = express.Router();

const usersRoutes = require('./api/users');
const profilesRoutes = require('./api/profiles');
const articlesRoutes = require('./api/articles');
const tagsRoutes = require('./api/tags');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use(usersRoutes);
router.use(profilesRoutes);
router.use(articlesRoutes);
router.use(tagsRoutes);

module.exports = router;
