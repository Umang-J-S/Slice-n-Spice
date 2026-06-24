import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

/**
 * Controller to handle Google OAuth callback.
 */
export const googleCallback = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('google', (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || 'Authentication failed',
      });
    }

    req.logIn(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      
      const state = req.query.state as string;
      if (state === '30') {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      } else {
        req.session.cookie.maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days (default fallback)
      }
      
      const redirectUrl = process.env.CLIENT_REDIRECT_URL || 'http://localhost:5173/';
      return res.redirect(redirectUrl);
    });
  })(req, res, next);
};

/**
 * Controller to logout user and destroy session.
 */
export const logout = (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    if (req.session) {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return next(destroyErr);
        }
        res.clearCookie('connect.sid');
        return res.json({ success: true, message: 'Logged out successfully' });
      });
    } else {
      return res.json({ success: true, message: 'Logged out' });
    }
  });
};

/**
 * Controller to get current authenticated user profile.
 */
export const getCurrentUser = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    return res.json({ success: true, user: req.user });
  }
  return res.status(401).json({ success: false, message: 'Not authenticated' });
};
