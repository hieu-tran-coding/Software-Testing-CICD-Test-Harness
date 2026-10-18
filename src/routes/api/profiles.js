const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user');
const memoryDb = require('../../store/memoryDb');
const { requireAuth, optionalAuth } = require('../../middleware/auth');

/**
 * GET /api/profiles/:username - Get a profile
 */
router.get('/profiles/:username', optionalAuth, (req, res) => {
  const targetUser = memoryDb.findUserByUsername(req.params.username);
  if (!targetUser) {
    return res.status(404).json({ errors: { message: 'Profile not found' } });
  }

  const isFollowing = req.user && Array.isArray(req.user.following)
    ? req.user.following.includes(targetUser.username)
    : false;

  res.status(200).json(UserModel.toProfileResponse(targetUser, isFollowing));
});

/**
 * POST /api/profiles/:username/follow - Follow a user
 */
router.post('/profiles/:username/follow', requireAuth, (req, res) => {
  const targetUser = memoryDb.findUserByUsername(req.params.username);
  if (!targetUser) {
    return res.status(404).json({ errors: { message: 'User to follow not found' } });
  }

  memoryDb.followUser(req.user.username, targetUser.username);
  res.status(200).json(UserModel.toProfileResponse(targetUser, true));
});

/**
 * DELETE /api/profiles/:username/follow - Unfollow a user
 */
router.delete('/profiles/:username/follow', requireAuth, (req, res) => {
  const targetUser = memoryDb.findUserByUsername(req.params.username);
  if (!targetUser) {
    return res.status(404).json({ errors: { message: 'User to unfollow not found' } });
  }

  memoryDb.unfollowUser(req.user.username, targetUser.username);
  res.status(200).json(UserModel.toProfileResponse(targetUser, false));
});

module.exports = router;
