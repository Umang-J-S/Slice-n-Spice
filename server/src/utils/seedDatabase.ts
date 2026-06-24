import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db';
import { Category, Item, Review, Special } from '../models/menuModel';

// Load environment variables
dotenv.config();

const londonCategories = [
  { name: 'Indian food', displayOrder: 1 },
  { name: 'Beverages', displayOrder: 2 },
  { name: 'Veg', displayOrder: 3 },
  { name: 'Non-veg', displayOrder: 4 },
  { name: 'Vegan', displayOrder: 5 },
];

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('Clearing existing database collections...');
    await Special.deleteMany();
    await Review.deleteMany();
    await Item.deleteMany();
    await Category.deleteMany();

    console.log('Inserting Categories...');
    const createdCategories = await Category.insertMany(londonCategories);

    // Map created categories by name for easy lookup
    const catMap: Record<string, mongoose.Types.ObjectId> = {};
    createdCategories.forEach((cat) => {
      catMap[cat.name] = cat._id as mongoose.Types.ObjectId;
    });

    console.log('Inserting Dummy Items...');
    const dummyItems = [
      {
        title: 'Chicken Tikka Masala',
        description: 'Classic creamy and spicy chicken curry.',
        price: 12.99,
        photoUrl: 'https://example.com/tikka.jpg',
        category: catMap['Indian food'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: 'Mango Lassi',
        description: 'Sweet and refreshing yogurt drink.',
        price: 4.50,
        photoUrl: 'https://example.com/lassi.jpg',
        category: catMap['Beverages'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Paneer Butter Masala',
        description: 'Rich cottage cheese curry.',
        price: 10.99,
        photoUrl: 'https://example.com/paneer.jpg',
        category: catMap['Veg'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Lamb Biryani',
        description: 'Aromatic rice cooked with tender lamb pieces.',
        price: 14.99,
        photoUrl: 'https://example.com/biryani.jpg',
        category: catMap['Non-veg'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: 'Vegan Chana Masala',
        description: 'Spiced chickpea curry.',
        price: 9.99,
        photoUrl: 'https://example.com/chana.jpg',
        category: catMap['Vegan'],
        dietaryAttributes: { isVegetarian: true, isVegan: true },
      },
    ];

    const createdItems = await Item.insertMany(dummyItems);

    console.log('Inserting Dummy Reviews...');
    const dummyReviews = [
      {
        item: createdItems[0]._id, // Chicken Tikka Masala
        rating: 5,
        reviewText: 'Absolutely delicious and authentic!',
      },
      {
        item: createdItems[1]._id, // Mango Lassi
        rating: 4,
        reviewText: 'Very refreshing, a bit too sweet for me though.',
      },
      {
        item: createdItems[4]._id, // Chana Masala
        rating: 5,
        reviewText: 'Best vegan curry I have had in London!',
      }
    ];

    await Review.insertMany(dummyReviews);
    
    const dummySpecials = [
      {
        item: createdItems[0]._id, // Make Chicken Tikka Masala a special
        date: new Date(),
      },
      {
        item: createdItems[3]._id, // Make Lamb Biryani a special
        date: new Date(),
      }
    ];

    await Special.insertMany(dummySpecials);

    console.log('Database completely seeded with dummy data!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
