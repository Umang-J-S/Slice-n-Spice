import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category, Item, Special } from '../../../models/menuModel';
import asyncHandler from '../../../utils/asyncHandler';

/**
 * @desc    Get the full menu (categories with their respective items)
 * @route   GET /api/v1/menu/full
 * @access  Public
 */
export const getFullMenu = asyncHandler(async (req: Request, res: Response) => {
  const fullMenu = await Category.aggregate([
    { $sort: { displayOrder: 1 } },
    {
      $lookup: {
        from: 'items', // This matches the auto-pluralized name of the 'Item' model
        localField: '_id',
        foreignField: 'category',
        as: 'items',
      },
    },
  ]);

  res.status(200).json({
    success: true,
    data: fullMenu,
  });
});

/**
 * @desc    Get all items for a specific category
 * @route   GET /api/v1/menu/categories/:categoryId/items
 * @access  Public
 */
export const getItemsByCategory = asyncHandler(async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId as string;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400);
    throw new Error('Invalid category ID');
  }

  const items = await Item.find({ category: categoryId }).populate('category');

  res.status(200).json({
    success: true,
    count: items.length,
    data: items,
  });
});

/**
 * @desc    Get a single item by ID and include its category details
 * @route   GET /api/v1/menu/items/:itemId
 * @access  Public
 */
export const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId as string;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid item ID');
  }

  const item = await Item.findById(itemId).populate('category');

  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  res.status(200).json({
    success: true,
    data: item,
  });
});

/**
 * @desc    Get all specials for today
 * @route   GET /api/v1/menu/specials
 * @access  Public
 */
export const getSpecials = asyncHandler(async (req: Request, res: Response) => {
  const specials = await Special.find({
    isActive: true,
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: null },
      { expiresAt: { $exists: false } }
    ]
  }).populate({
    path: 'item',
    populate: { path: 'category' }
  });

  res.status(200).json({
    success: true,
    data: specials,
  });
});
