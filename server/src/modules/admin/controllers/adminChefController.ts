import { Request, Response } from 'express';
import { Chef } from '../../../models/chefModel';
import asyncHandler from '../../../utils/asyncHandler';

/**
 * Controller to add a new chef.
 */
export const createChef = asyncHandler(async (req: Request, res: Response) => {
  const newChef = new Chef(req.body);
  const savedChef = await newChef.save();

  res.status(201).json({
    success: true,
    message: 'Chef created successfully',
    data: savedChef,
  });
});

/**
 * Controller to update a chef.
 */
export const updateChef = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedChef = await Chef.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
  
  if (!updatedChef) {
    res.status(404);
    throw new Error('Chef not found');
  }
  
  res.status(200).json({
    success: true,
    message: 'Chef updated successfully',
    data: updatedChef,
  });
});

/**
 * Controller to delete a chef.
 */
export const deleteChef = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deletedChef = await Chef.findByIdAndDelete(id);
  
  if (!deletedChef) {
    res.status(404);
    throw new Error('Chef not found');
  }
  
  res.status(200).json({
    success: true,
    message: 'Chef deleted successfully',
  });
});
