import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category, Item } from '../models/menuModel';

// Load environment variables from .env
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || '';

const categoriesData = [
  { name: 'London Classics', displayOrder: 1 },
  { name: 'British Roasts', displayOrder: 2 },
  { name: 'East End Specialties', displayOrder: 3 },
];

const itemsData = {
  'London Classics': [
    {
      title: 'Traditional Fish and Chips',
      description: 'Beer-battered Atlantic cod served with thick-cut chips, mushy peas, and homemade tartar sauce.',
      price: 18.50,
      photoUrl: 'https://images.unsplash.com/photo-1599583002636-9db809f61b0a?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Bangers and Mash',
      description: 'Cumberland sausages on a bed of creamy mashed potatoes, smothered in rich onion gravy.',
      price: 16.00,
      photoUrl: 'https://images.unsplash.com/photo-1627054234005-4f364020a597?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Pie and Liquor',
      description: 'Classic East London minced beef pie served with mashed potatoes and traditional green parsley liquor.',
      price: 14.50,
      photoUrl: 'https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Jellied Eels',
      description: 'A historic London delicacy. Chopped eels boiled in a spiced stock that sets into a jelly.',
      price: 12.00,
      photoUrl: 'https://images.unsplash.com/photo-1601314112349-db37209307dd?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Scotch Egg Ploughmans',
      description: 'Soft-boiled egg wrapped in pork sausage meat and breadcrumbs, served with mature cheddar, pickles, and crusty bread.',
      price: 15.00,
      photoUrl: 'https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Steak and Ale Pie',
      description: 'Slow-cooked British beef in a rich ale gravy, encased in golden shortcrust pastry.',
      price: 17.50,
      photoUrl: 'https://images.unsplash.com/photo-1606277028905-1a221f7edbe4?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Toad in the Hole',
      description: 'Premium pork sausages baked in a giant Yorkshire pudding batter, served with onion gravy.',
      price: 16.50,
      photoUrl: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Cornish Pasty Platter',
      description: 'Traditional D-shaped pastry filled with beef, potatoes, swede, and onions.',
      price: 14.00,
      photoUrl: 'https://images.unsplash.com/photo-1620023419088-348633c7f999?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Full English Breakfast',
      description: 'Bacon, sausages, eggs, black pudding, baked beans, tomatoes, mushrooms, and fried bread. Available all day.',
      price: 19.50,
      photoUrl: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Cockles and Whelks Board',
      description: 'Fresh seafood board featuring traditional London cockles and whelks with malt vinegar and white pepper.',
      price: 16.00,
      photoUrl: 'https://images.unsplash.com/photo-1565557612260-91cdfb142a77?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    }
  ],
  'British Roasts': [
    {
      title: 'Roast Beef Striploin',
      description: '28-day aged British beef served medium rare with Yorkshire pudding, roast potatoes, and horseradish cream.',
      price: 24.50,
      photoUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Slow-Roasted Pork Belly',
      description: 'Crispy crackling pork belly with apple sauce, sage stuffing, and seasonal roasted root vegetables.',
      price: 22.00,
      photoUrl: 'https://images.unsplash.com/photo-1602931115598-f5ee566f1947?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Half Roast Chicken',
      description: 'Herb-butter basted chicken with bread sauce, pigs in blankets, and rich gravy.',
      price: 21.50,
      photoUrl: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Roast Lamb Leg',
      description: 'Tender Welsh lamb leg with mint sauce, roasted parsnips, and proper gravy.',
      price: 25.00,
      photoUrl: 'https://images.unsplash.com/photo-1603073385627-2c1fb7692138?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Venison Haunch',
      description: 'Wild British venison roast with red currant jus, dauphinoise potatoes, and braised red cabbage.',
      price: 28.00,
      photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Gammon Joint',
      description: 'Honey-mustard glazed roast gammon with a fried egg and thick-cut chips.',
      price: 20.00,
      photoUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Crown of Turkey',
      description: 'Roast turkey breast with cranberry sauce, chestnut stuffing, and Brussels sprouts.',
      price: 23.00,
      photoUrl: 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Beef Wellington',
      description: 'Fillet steak coated in mushroom duxelles and prosciutto, wrapped in puff pastry.',
      price: 35.00,
      photoUrl: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Roast Duck Breast',
      description: 'Pan-roasted Gressingham duck with cherry port sauce and fondant potatoes.',
      price: 27.50,
      photoUrl: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Mixed Roast Platter',
      description: 'The ultimate Sunday roast featuring a slice of beef, pork, and chicken with all the trimmings.',
      price: 32.00,
      photoUrl: 'https://images.unsplash.com/photo-1544025162-811114b097b3?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    }
  ],
  'East End Specialties': [
    {
      title: 'Chicken Tikka Masala',
      description: 'The famous British-Indian curry. Roasted chicken chunks in a spicy, creamy orange sauce.',
      price: 18.00,
      photoUrl: 'https://images.unsplash.com/photo-1565557612260-91cdfb142a77?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Brick Lane Lamb Curry',
      description: 'A fiery lamb curry inspired by the legendary curry houses of London\'s Brick Lane.',
      price: 20.50,
      photoUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Spicy Keema Naan',
      description: 'Fresh tandoori baked flatbread stuffed with spiced minced lamb.',
      price: 12.00,
      photoUrl: 'https://images.unsplash.com/photo-1580959375944-abd7e991f971?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Tandoori Mixed Grill',
      description: 'Sizzling platter of tandoori chicken, lamb tikka, seekh kebabs, and tiger prawns.',
      price: 26.00,
      photoUrl: 'https://images.unsplash.com/photo-1599487405270-87a4140cdcb6?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Prawn Madras',
      description: 'A hot and fiery tomato-based curry with plump king prawns, originating from the British Indian restaurant scene.',
      price: 22.50,
      photoUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Chicken Jalfrezi',
      description: 'Stir-fried chicken curry with green chilies, bell peppers, and onions in a thick spicy sauce.',
      price: 18.50,
      photoUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Lamb Rogan Josh',
      description: 'Aromatic braised lamb curry packed with Kashmiri chilies and caramelized onions.',
      price: 21.00,
      photoUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Beef Vindaloo',
      description: 'An intensely spicy and tangy curry originally brought to London by Goan immigrants.',
      price: 19.50,
      photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Chicken Korma',
      description: 'A mild, sweet, and creamy curry made with almonds, coconut, and tender chicken.',
      price: 17.50,
      photoUrl: 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    },
    {
      title: 'Shish Kebab Wrap',
      description: 'Grilled minced lamb skewers wrapped in a warm flatbread with garlic sauce and chili.',
      price: 14.50,
      photoUrl: 'https://images.unsplash.com/photo-1528736235302-52922df5c122?w=800&q=80',
      dietaryAttributes: { isVegetarian: false, isVegan: false, isNonVeg: true }
    }
  ]
};

const seedLondonMenu = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully!');

    for (const cat of categoriesData) {
      // Create Category
      const newCategory = await Category.create(cat);
      console.log(`Created Category: ${newCategory.name}`);

      // Get items for this category
      const items = itemsData[cat.name as keyof typeof itemsData];
      
      if (items && items.length > 0) {
        // Map category ID to items
        const itemsWithCategory = items.map(item => ({
          ...item,
          category: newCategory._id
        }));

        await Item.insertMany(itemsWithCategory);
        console.log(`-> Inserted ${items.length} items for ${newCategory.name}`);
      }
    }

    console.log('London Menu Seeding Complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedLondonMenu();
