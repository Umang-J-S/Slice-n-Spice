import express from 'express';
import { getAllChefs, getChefById } from '../controllers/chefController';

const router = express.Router();

// @desc    Get all chefs
// @route   GET /api/v1/chefs
router.get('/', getAllChefs);

// @desc    Get a single chef by ID
// @route   GET /api/v1/chefs/:id
router.get('/:id', getChefById);

export default router;
