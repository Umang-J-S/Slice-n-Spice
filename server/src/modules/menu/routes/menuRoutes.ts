import express from 'express';
import { 
  getFullMenu, 
  getItemsByCategory, 
  getItemById, 
  getSpecials,
  getTopRatedItems,
  addReview,
  getItemReviews,
  getMyReview
} from '../controllers/menuController';
import { isAuthenticated } from '../../auth/middlewares/authMiddleware';

const router = express.Router();

// @desc    Get the full menu (categories with their respective items)
// @route   GET /api/v1/menu/full
router.get('/full', getFullMenu);

// @desc    Get top 8 highest-rated items
// @route   GET /api/v1/menu/top-rated
router.get('/top-rated', getTopRatedItems);

// @desc    Get all specials for today
// @route   GET /api/v1/menu/specials
router.get('/specials', getSpecials);

// @desc    Get all items for a specific category
// @route   GET /api/v1/menu/categories/:categoryId/items
router.get('/categories/:categoryId/items', getItemsByCategory);

// @desc    Get a single item by ID (includes category info)
// @route   GET /api/v1/menu/items/:itemId
router.get('/items/:itemId', getItemById);

// @desc    Submit a review for an item
// @route   POST /api/v1/menu/items/:itemId/reviews
router.post('/items/:itemId/reviews', isAuthenticated, addReview);

// @desc    Get all reviews for an item
// @route   GET /api/v1/menu/items/:itemId/reviews
router.get('/items/:itemId/reviews', getItemReviews);

// @desc    Get current user's review for an item
// @route   GET /api/v1/menu/items/:itemId/reviews/me
router.get('/items/:itemId/reviews/me', isAuthenticated, getMyReview);

export default router;
