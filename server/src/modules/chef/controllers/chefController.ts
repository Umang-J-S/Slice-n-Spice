import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Chef } from '../../../models/chefModel';
import asyncHandler from '../../../utils/asyncHandler';

/**
 * @desc    Get all chefs
 * @route   GET /api/v1/chefs
 * @access  Public
 */
export const getAllChefs = asyncHandler(async (req: Request, res: Response) => {
  const chefs = await Chef.find();

  res.status(200).json({
    success: true,
    count: chefs.length,
    data: chefs,
  });
});

/**
 * @desc    Get a single chef by ID
 * @route   GET /api/v1/chefs/:id
 * @access  Public
 */
export const getChefById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error('Invalid chef ID');
  }

  const chef = await Chef.findById(id);

  if (!chef) {
    res.status(404);
    throw new Error('Chef not found');
  }

  res.status(200).json({
    success: true,
    data: chef,
  });
});
