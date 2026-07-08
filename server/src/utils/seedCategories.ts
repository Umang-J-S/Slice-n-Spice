import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '@/config/db';
import { Category } from '@/models/menuModel';

// Load environment variables
dotenv.config();

const londonCategories = [
  { name: 'Indian food', displayOrder: 1 },
  { name: 'Beverages', displayOrder: 2 },
  { name: 'Veg', displayOrder: 3 },
  { name: 'Non-veg', displayOrder: 4 },
  { name: 'Vegan', displayOrder: 5 },
];

const seedCategories = async () => {
  try {
    await connectDB();

    console.log('Clearing existing categories...');
    await Category.deleteMany();

    console.log('Inserting London market categories...');
    await Category.insertMany(londonCategories);

    console.log('Categories seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
