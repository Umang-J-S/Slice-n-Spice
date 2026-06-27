import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category, Item, Special, Review } from '../../../models/menuModel';
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
        from: 'items',
        let: { categoryId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$category', '$$categoryId'] } } },
          {
            $lookup: {
              from: 'reviews',
              localField: '_id',
              foreignField: 'item',
              as: 'reviews',
            },
          },
          {
            $addFields: {
              avgRating: { $avg: '$reviews.rating' },
              reviewCount: { $size: '$reviews' },
            },
          },
          {
            $project: { reviews: 0 },
          },
        ],
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

/**
 * @desc    Get top 8 highest-rated items
 * @route   GET /api/v1/menu/top-rated
 * @access  Public
 */
export const getTopRatedItems = asyncHandler(async (req: Request, res: Response) => {
  const topRated = await Item.aggregate([
    {
      $lookup: {
        from: 'reviews',
        localField: '_id',
        foreignField: 'item',
        as: 'reviews',
      },
    },
    {
      $addFields: {
        avgRating: { $avg: '$reviews.rating' },
        reviewCount: { $size: '$reviews' },
      },
    },
    {
      $sort: { avgRating: -1, reviewCount: -1 },
    },
    { $limit: 8 },
  ]);

  res.status(200).json({
    success: true,
    data: topRated,
  });
});

/**
 * @desc    Submit a review for an item
 * @route   POST /api/v1/menu/items/:itemId/reviews
 * @access  Private
 */
export const addReview = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId as string;
  const { rating, reviewText } = req.body;
  const user = (req as any).user;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid item ID');
  }

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Please provide a valid rating between 1 and 5');
  }

  // Check if item exists
  const item = await Item.findById(itemId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found');
  }

  // Check if user already reviewed this item
  const existingReview = await Review.findOne({ item: itemId, user: user._id });
  if (existingReview) {
    existingReview.rating = rating;
    existingReview.reviewText = reviewText;
    await existingReview.save();
    
    return res.status(200).json({
      success: true,
      data: existingReview,
    });
  }

  const review = await Review.create({
    item: itemId,
    user: user._id,
    rating,
    reviewText,
  });

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Get current user's review for an item
 * @route   GET /api/v1/menu/items/:itemId/reviews/me
 * @access  Private
 */
export const getMyReview = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId as string;
  const user = (req as any).user;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid item ID');
  }

  const review = await Review.findOne({ item: itemId, user: user._id });

  res.status(200).json({
    success: true,
    data: review || null,
  });
});

/**
 * @desc    Get all reviews for an item
 * @route   GET /api/v1/menu/items/:itemId/reviews
 * @access  Public
 */
export const getItemReviews = asyncHandler(async (req: Request, res: Response) => {
  const itemId = req.params.itemId as string;

  if (!mongoose.Types.ObjectId.isValid(itemId)) {
    res.status(400);
    throw new Error('Invalid item ID');
  }

  const reviews = await Review.find({ item: itemId }).populate('user', 'name email').sort({ date: -1 });

  // Calculate average dynamically if needed
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  res.status(200).json({
    success: true,
    count: reviews.length,
    avgRating,
    data: reviews,
  });
});
