import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to verify that the request is authenticated.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({
    success: false,
    message: 'Access denied. You must be logged in to access this resource.',
  });
};

/**
 * Middleware to verify that the authenticated user has the 'admin' role.
 */
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  
  if (user && user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Administrator privileges required.',
  });
};
