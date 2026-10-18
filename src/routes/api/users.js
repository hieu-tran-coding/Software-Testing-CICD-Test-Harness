const express = require('express');
const router = express.Router();
const UserModel = require('../../models/user');
const memoryDb = require('../../store/memoryDb');
const { generateToken } = require('../../utils/jwt');
const { requireAuth } = require('../../middleware/auth');
const bcrypt = require('bcryptjs');

/**
 * POST /api/users - Registration
 */
router.post('/users', async (req, res, next) => {
  try {
    const userData = req.body && req.body.user ? req.body.user : req.body;

    if (!userData) {
      return res.status(422).json({
        errors: { body: ['User data is required'] }
      });
    }

    // Check duplicate email
    if (userData.email && memoryDb.findUserByEmail(userData.email)) {
      return res.status(422).json({
        errors: { email: ['has already been taken'] }
      });
    }

    // Check duplicate username
    if (userData.username && memoryDb.findUserByUsername(userData.username)) {
      return res.status(422).json({
        errors: { username: ['has already been taken'] }
      });
    }

    const newUser = await UserModel.create(userData);
    memoryDb.saveUser(newUser);

    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    });

    res.status(201).json(UserModel.toUserResponse(newUser, token));
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/users/login - Authentication
 */
router.post('/users/login', async (req, res, next) => {
  try {
    const loginData = req.body && req.body.user ? req.body.user : req.body;

    if (!loginData || !loginData.email || !loginData.password) {
      return res.status(422).json({
        errors: { body: ["can't be blank"] }
      });
    }

    const user = memoryDb.findUserByEmail(loginData.email);
    if (!user) {
      return res.status(422).json({
        errors: { 'email or password': ['is invalid'] }
      });
    }

    const isMatch = await UserModel.verifyPassword(loginData.password, user.passwordHash);
    if (!isMatch) {
      return res.status(422).json({
        errors: { 'email or password': ['is invalid'] }
      });
    }

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email
    });

    res.status(200).json(UserModel.toUserResponse(user, token));
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/user - Get current logged-in user
 */
router.get('/user', requireAuth, (req, res) => {
  res.status(200).json(UserModel.toUserResponse(req.user, req.token));
});

/**
 * PUT /api/user - Update current user
 */
router.put('/user', requireAuth, async (req, res, next) => {
  try {
    const updates = req.body && req.body.user ? req.body.user : req.body;
    const currentUser = req.user;

    const updatedFields = {};

    if (updates.email && updates.email !== currentUser.email) {
      const existing = memoryDb.findUserByEmail(updates.email);
      if (existing && existing.id !== currentUser.id) {
        return res.status(422).json({ errors: { email: ['has already been taken'] } });
      }
      updatedFields.email = updates.email.trim().toLowerCase();
    }

    if (updates.username && updates.username !== currentUser.username) {
      const existing = memoryDb.findUserByUsername(updates.username);
      if (existing && existing.id !== currentUser.id) {
        return res.status(422).json({ errors: { username: ['has already been taken'] } });
      }
      updatedFields.username = updates.username.trim();
    }

    if (typeof updates.bio === 'string') {
      updatedFields.bio = updates.bio;
    }

    if (typeof updates.image === 'string') {
      updatedFields.image = updates.image;
    }

    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updatedFields.passwordHash = await bcrypt.hash(updates.password, salt);
    }

    const updatedUser = memoryDb.updateUser(currentUser.id, updatedFields);
    res.status(200).json(UserModel.toUserResponse(updatedUser, req.token));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
