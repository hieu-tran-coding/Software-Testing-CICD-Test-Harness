const express = require('express');
const router = express.Router();
const memoryDb = require('../../store/memoryDb');

/**
 * GET /api/tags - Get list of all tags
 */
router.get('/tags', (req, res) => {
  const tags = memoryDb.getAllTags();
  res.status(200).json({ tags });
});

module.exports = router;
