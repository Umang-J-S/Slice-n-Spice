import { Request, Response } from 'express';
import { Category, Item, Special } from '../../../models/menuModel';
import { Chef } from '../../../models/chefModel';
import asyncHandler from '../../../utils/asyncHandler';

/**
 * Controller to retrieve admin dashboard stats.
 */
export const getDashboardStats = (req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Welcome to the Admin Dashboard!',
    stats: {
      totalUsers: 142,
      activeSessions: 8,
      systemStatus: 'Optimal',
      databaseStatus: 'Connected',
    },
  });
};

/**
 * Controller to add a new menu item.
 */
export const addItem = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Add admin validation logic here (e.g. check for valid fields using express-validator)
  // TODO: Add admin authentication check here (if not already handled by route middleware)

  const { title, description, price, photoUrl, category, dietaryAttributes } = req.body;

  const newItem = new Item({
    title,
    description,
    price,
    photoUrl,
    category,
    dietaryAttributes
  });

  const savedItem = await newItem.save();

  res.status(201).json({
    success: true,
    message: 'Item added successfully',
    data: savedItem,
  });
});

/**
 * Controller to update a menu item.
 */
export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedItem = await Item.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  
  if (!updatedItem) {
    res.status(404);
    throw new Error('Item not found');
  }
  
  res.status(200).json({
    success: true,
    message: 'Item updated successfully',
    data: updatedItem,
  });
});

/**
 * Controller to delete a menu item.
 */
export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedItem = await Item.findByIdAndDelete(id);
  
  if (!deletedItem) {
    res.status(404);
    throw new Error('Item not found');
  }
  
  // Clean up references
  await Special.deleteMany({ item: id });
  
  res.status(200).json({
    success: true,
    message: 'Item deleted successfully',
  });
});

/**
 * Controller to add a special item.
 */
export const addSpecial = asyncHandler(async (req: Request, res: Response) => {
  const { item, date } = req.body;

  // Check if the item actually exists
  const itemExists = await Item.findById(item);
  if (!itemExists) {
    res.status(404);
    throw new Error('Item not found');
  }

  const newSpecial = new Special({
    item,
    date: date ? new Date(date) : undefined // Mongoose schema defaults to Date.now if undefined
  });

  const savedSpecial = await newSpecial.save();

  res.status(201).json({
    success: true,
    message: 'Special item added successfully',
  });
  
});

/**
 * Controller to add a new category.
 */
export const addCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, displayOrder } = req.body;

  const newCategory = new Category({
    name,
    displayOrder: displayOrder || 0,
  });

  const savedCategory = await newCategory.save();

  res.status(201).json({
    success: true,
    message: 'Category added successfully',
    data: savedCategory,
  });
});

/**
 * Controller to update a category.
 */
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  
  if (!updatedCategory) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: updatedCategory,
  });
});

/**
 * Controller to delete a category.
 */
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedCategory = await Category.findByIdAndDelete(id);
  
  if (!deletedCategory) {
    res.status(404);
    throw new Error('Category not found');
  }
  
  // Remove items in this category
  await Item.deleteMany({ category: id });
  
  res.status(200).json({
    success: true,
    message: 'Category deleted successfully',
  });
});

/**
 * Controller to perform a global search across Category, Item, Chef, and Special collections.
 */
export const globalSearch = asyncHandler(async (req: Request, res: Response) => {
  const query = req.query.q as string || '';
  
  if (!query) {
    res.status(200).json({
      success: true,
      data: {
        categories: [],
        items: [],
        chefs: [],
        specials: []
      }
    });
    return;
  }

  const searchRegex = new RegExp(query, 'i');

  // Search each collection in parallel
  const categoriesPromise = Category.find({ name: searchRegex }).limit(10);
  const itemsPromise = Item.find({
    $or: [
      { title: searchRegex },
      { description: searchRegex }
    ]
  }).populate('category').limit(10);
  const chefsPromise = Chef.find({
    $or: [
      { name: searchRegex },
      { role: searchRegex },
      { bio: searchRegex },
      { specialties: searchRegex }
    ]
  }).limit(10);

  // For Specials, find items matching the search query, then find Specials referencing them
  const matchingItems = await Item.find({
    $or: [
      { title: searchRegex },
      { description: searchRegex }
    ]
  }).select('_id');
  const matchingItemIds = matchingItems.map(item => item._id);
  const specialsPromise = Special.find({ item: { $in: matchingItemIds } }).populate('item').limit(10);

  const [categories, items, chefs, specials] = await Promise.all([
    categoriesPromise,
    itemsPromise,
    chefsPromise,
    specialsPromise
  ]);

  res.status(200).json({
    success: true,
    data: {
      categories,
      items,
      chefs,
      specials
    }
  });
});

