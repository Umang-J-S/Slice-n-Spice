import express from 'express';
import { getDashboardStats, addItem, addSpecial, addCategory, updateItem, deleteItem, updateCategory, deleteCategory, globalSearch } from '../controllers/adminController';
import { createChef, updateChef, deleteChef } from '../controllers/adminChefController';
import { isAuthenticated, isAdmin } from '../../auth/middlewares/authMiddleware';
import { validateRequest } from '../../../middlewares/validateRequest';
import { addItemSchema, updateItemSchema } from '../validations/itemValidation';
import { addSpecialSchema } from '../validations/specialValidation';
import { addCategorySchema, updateCategorySchema } from '../validations/categoryValidation';
import { createChefSchema, updateChefSchema } from '../validations/chefValidation';

const router = express.Router();

// Protect all admin routes - require authentication and admin role
router.use(isAuthenticated);
router.use(isAdmin);    

// @desc    Get admin dashboard statistics
// @route   GET /api/v1/admin/dashboard
router.get('/dashboard', getDashboardStats);

// @desc    Global search for admin across all models
// @route   GET /api/v1/admin/search
router.get('/search', globalSearch);

// @desc    Add a new menu item
// @route   POST /api/v1/admin/items
// /* TODO: Admin Authentication Middleware - Handled globally above */
router.post('/items', validateRequest(addItemSchema), addItem);

// @desc    Add a new special item
// @route   POST /api/v1/admin/specials
router.post('/specials', validateRequest(addSpecialSchema), addSpecial);

// @desc    Add a new category
// @route   POST /api/v1/admin/categories
router.post('/categories', validateRequest(addCategorySchema), addCategory);

// @desc    Update a menu item
// @route   PUT /api/v1/admin/items/:id
router.put('/items/:id', validateRequest(updateItemSchema), updateItem);

// @desc    Delete a menu item
// @route   DELETE /api/v1/admin/items/:id
router.delete('/items/:id', deleteItem);

// @desc    Update a category
// @route   PUT /api/v1/admin/categories/:id
router.put('/categories/:id', validateRequest(updateCategorySchema), updateCategory);

// @desc    Delete a category
// @route   DELETE /api/v1/admin/categories/:id
router.delete('/categories/:id', deleteCategory);

// @desc    Add a new chef
// @route   POST /api/v1/admin/chefs
router.post('/chefs', validateRequest(createChefSchema), createChef);

// @desc    Update a chef
// @route   PUT /api/v1/admin/chefs/:id
router.put('/chefs/:id', validateRequest(updateChefSchema), updateChef);

// @desc    Delete a chef
// @route   DELETE /api/v1/admin/chefs/:id
router.delete('/chefs/:id', deleteChef);

export default router;
