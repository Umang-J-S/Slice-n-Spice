import express from 'express';
import passport from 'passport';
import { googleCallback, logout, getCurrentUser } from '../controllers/authController';

const router = express.Router();

// @desc    Initiate Google OAuth
// @route   GET /api/v1/auth/google
router.get(
  '/google',
  (req, res, next) => {
    const keepLoggedIn = req.query.keepLoggedIn as string || '1';
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      state: keepLoggedIn
    })(req, res, next);
  }
);

// @desc    Google OAuth Callback
// @route   GET /api/v1/auth/google/callback
router.get('/google/callback', googleCallback);

// @desc    Logout user
// @route   GET /api/v1/auth/logout
router.get('/logout', logout);

// @desc    Get currently logged-in user
// @route   GET /api/v1/auth/current-user
router.get('/current-user', getCurrentUser);

export default router;
