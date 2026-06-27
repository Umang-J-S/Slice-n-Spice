import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Category, Item, Special, Review } from '../../../models/menuModel';
import asyncHandler from '../../../utils/asyncHandler';
import { redisClient } from '../../../services/redis';

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
          { $match: { $expr: { $eq: ['$category', '$$categoryId'] }, isDeleted: { $ne: true } } },
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

  const items = await Item.find({ category: categoryId, isDeleted: { $ne: true } }).populate('category');

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

  const item = await Item.findOne({ _id: itemId, isDeleted: { $ne: true } }).populate('category');

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
    match: { isDeleted: { $ne: true } },
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
  const cacheKey = 'menu:top-rated';
  
  if (redisClient) {
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedData),
      });
    }
  }

  const topRated = await Review.aggregate([
    {
      $group: {
        _id: '$item',
        avgRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'items',
        localField: '_id',
        foreignField: '_id',
        as: 'itemDetails'
      }
    },
    { $unwind: '$itemDetails' },
    { $match: { 'itemDetails.isDeleted': { $ne: true } } },
    { $sort: { avgRating: -1, reviewCount: -1 } },
    { $limit: 8 },
    {
      $project: {
        _id: '$_id',
        avgRating: 1,
        reviewCount: 1,
        title: '$itemDetails.title',
        description: '$itemDetails.description',
        price: '$itemDetails.price',
        photoUrl: '$itemDetails.photoUrl',
        category: '$itemDetails.category',
        dietaryAttributes: '$itemDetails.dietaryAttributes'
      }
    }
  ]);

  // Fallback padding logic to ensure we always have 8 items
  if (topRated.length < 8) {
    const existingIds = topRated.map((item: any) => item._id);

    // Fetch all remaining items that are not deleted
    const remainingItems = await Item.find({
      _id: { $nin: existingIds },
      isDeleted: { $ne: true }
    });

    // Shuffle remaining items for randomness
    const shuffledItems = remainingItems.sort(() => 0.5 - Math.random());

    // Group by category
    const categoryMap = new Map<string, any[]>();
    for (const item of shuffledItems) {
      const catId = item.category.toString();
      if (!categoryMap.has(catId)) categoryMap.set(catId, []);
      categoryMap.get(catId)!.push(item);
    }

    const categories = Array.from(categoryMap.values());
    let catIndex = 0;

    // Pick round-robin from categories
    while (topRated.length < 8 && categories.length > 0) {
      const currentCatArray = categories[catIndex % categories.length];
      
      if (currentCatArray.length > 0) {
        const item = currentCatArray.shift();
        topRated.push({
          _id: item._id,
          avgRating: 0, // Fallback items have 0 rating
          reviewCount: 0,
          title: item.title,
          description: item.description,
          price: item.price,
          photoUrl: item.photoUrl,
          category: item.category,
          dietaryAttributes: item.dietaryAttributes
        });
      } else {
        // Remove empty category array
        categories.splice(catIndex % categories.length, 1);
        continue; // Do not increment catIndex
      }
      catIndex++;
    }
  }

  if (redisClient) {
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(topRated)); // Cache for 1 hour
  }

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

  // Invalidate top-rated cache
  if (redisClient) {
    await redisClient.del('menu:top-rated');
  }

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
