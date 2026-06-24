import express from 'express';
import { getFullMenu, getItemsByCategory, getItemById, getSpecials } from '../controllers/menuController';

const router = express.Router();

// @desc    Get the full menu (categories with their respective items)
// @route   GET /api/v1/menu/full
router.get('/full', getFullMenu);

// @desc    Get all specials for today
// @route   GET /api/v1/menu/specials
router.get('/specials', getSpecials);

// @desc    Get all items for a specific category
// @route   GET /api/v1/menu/categories/:categoryId/items
router.get('/categories/:categoryId/items', getItemsByCategory);

// @desc    Get a single item by ID (includes category info)
// @route   GET /api/v1/menu/items/:itemId
router.get('/items/:itemId', getItemById);

export default router;
