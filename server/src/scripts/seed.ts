import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category, Item, Special, Review } from '../models/menuModel';
import { Chef } from '../models/chefModel';
import connectDB from '../config/db';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Clear existing data
    await Category.deleteMany();
    await Item.deleteMany();
    await Special.deleteMany();
    await Review.deleteMany();
    await Chef.deleteMany();

    console.log('Cleared existing menu and chef data.');

    // Create Categories
    const categoriesData = [
      { name: 'Starters & Appetizers', displayOrder: 1 },
      { name: 'Wood-Fired Pizzas', displayOrder: 2 },
      { name: 'Pasta & Risotto', displayOrder: 3 },
      { name: 'Desserts', displayOrder: 4 },
      { name: 'Beverages', displayOrder: 5 },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Added ${createdCategories.length} categories.`);

    // Map category names to their new ObjectIds
    const categoryMap: { [key: string]: mongoose.Types.ObjectId } = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id as mongoose.Types.ObjectId;
    });

    // Create Items
    const itemsData = [
      {
        title: 'Classic Garlic Bread',
        description: 'Toasted ciabatta topped with garlic, herb butter, and melted mozzarella.',
        price: 6.99,
        photoUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Starters & Appetizers'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Tomato Basil Bruschetta',
        description: 'Fresh diced tomatoes, basil, garlic, and olive oil on toasted rustic bread.',
        price: 8.50,
        photoUrl: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Starters & Appetizers'],
        dietaryAttributes: { isVegetarian: true, isVegan: true },
      },
      {
        title: 'Margherita Pizza',
        description: 'San Marzano tomato sauce, fresh mozzarella, and basil leaves.',
        price: 14.99,
        photoUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Wood-Fired Pizzas'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Truffle Mushroom Pizza',
        description: 'White sauce, roasted wild mushrooms, truffle oil, and thyme.',
        price: 18.99,
        photoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Wood-Fired Pizzas'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Spicy Pepperoni Pizza',
        description: 'Tomato sauce, mozzarella, spicy pepperoni, and a drizzle of hot honey.',
        price: 17.50,
        photoUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Wood-Fired Pizzas'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: 'Spaghetti Carbonara',
        description: 'Classic Roman pasta with crispy pancetta, egg yolk, pecorino cheese, and black pepper.',
        price: 19.99,
        photoUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Pasta & Risotto'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: 'Penne Arrabbiata',
        description: 'Penne pasta tossed in a spicy garlic and tomato sauce.',
        price: 15.99,
        photoUrl: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Pasta & Risotto'],
        dietaryAttributes: { isVegetarian: true, isVegan: true },
      },
      {
        title: 'Classic Tiramisu',
        description: 'Espresso-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.',
        price: 9.00,
        photoUrl: 'https://images.unsplash.com/photo-1571115177098-24ebd5e1814e?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Desserts'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Panna Cotta',
        description: 'Vanilla bean panna cotta served with a mixed berry compote.',
        price: 8.50,
        photoUrl: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Desserts'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: 'Fresh Lemonade',
        description: 'House-made sparkling lemonade with a hint of mint.',
        price: 4.50,
        photoUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Beverages'],
        dietaryAttributes: { isVegetarian: true, isVegan: true },
      },
      {
        title: 'Espresso',
        description: 'Rich and bold double shot of Italian espresso.',
        price: 3.50,
        photoUrl: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800',
        category: categoryMap['Beverages'],
        dietaryAttributes: { isVegetarian: true, isVegan: true },
      },
    ];

    const createdItems = await Item.insertMany(itemsData);
    console.log(`Added ${createdItems.length} items.`);

    // Add a Special
    const specialData = {
      item: createdItems[3]._id, // Truffle Mushroom Pizza
      date: new Date(),
    };
    await Special.create(specialData);
    console.log("Added a Today's Special.");

    // Create Chefs
    const chefsData = [
      {
        name: 'Gordon Ramsay',
        role: 'Executive Chef',
        bio: 'Multi-Michelin starred chef known for his fiery temper and exquisite culinary skills.',
        photoUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
        specialties: ['Beef Wellington', 'Scallops'],
        experienceYears: 30,
      },
      {
        name: 'Dominique Ansel',
        role: 'Head Pastry Chef',
        bio: 'World-renowned pastry chef, inventor of the Cronut and master of French desserts.',
        photoUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=800',
        specialties: ['French Pastries', 'Cronuts', 'Tarts'],
        experienceYears: 20,
      },
      {
        name: 'Massimo Bottura',
        role: 'Sous Chef',
        bio: 'Italian restaurateur blending tradition with innovation to create modern masterpieces.',
        photoUrl: 'https://images.unsplash.com/photo-1581349485608-9469926a8e5e?auto=format&fit=crop&q=80&w=800',
        specialties: ['Modern Italian', 'Tortellini'],
        experienceYears: 25,
      },
    ];

    const createdChefs = await Chef.insertMany(chefsData);
    console.log(`Added ${createdChefs.length} chefs.`);

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
