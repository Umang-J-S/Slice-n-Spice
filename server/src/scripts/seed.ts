import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category, Item, Special, Review } from '@/models/menuModel';
import { Chef } from '@/models/chefModel';
import connectDB from '@/config/db';

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
      { name: 'Meat & Seafood', displayOrder: 6 },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`Added ${createdCategories.length} categories.`);

    const categoryMap: { [key: string]: mongoose.Types.ObjectId } = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id as mongoose.Types.ObjectId;
    });

    // Create Items
    const itemsData = [
      {
        title: "Truffle Mushroom Risotto",
        price: 24.99,
        description: "Creamy Carnaroli rice cooked with wild porchini, fresh herbs, and white truffle essence.",
        photoUrl: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Pasta & Risotto'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: "Wood-Fired Margherita",
        price: 18.99,
        description: "San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil, and extra virgin olive oil.",
        photoUrl: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Wood-Fired Pizzas'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: "Pistachio Lamb Cutlets",
        price: 36.99,
        description: "Grass-fed lamb racks encrusted in crushed pistachios, served with red wine reduction.",
        photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Meat & Seafood'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Artisanal Lobster Ravioli",
        price: 31.99,
        description: "Handmade pasta pockets filled with Atlantic lobster in a rich saffron-infused cream sauce.",
        photoUrl: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Pasta & Risotto'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Wagyu Beef Ribeye",
        price: 64.99,
        description: "A5 Grade Japanese Wagyu cooked over open wood-fire coals, served with smoked butter.",
        photoUrl: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Meat & Seafood'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Saffron Seafood Risotto",
        price: 33.99,
        description: "Luxe saffron rice layered with tiger prawns, scallops, fresh mussels, and baby squid.",
        photoUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Pasta & Risotto'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Tiramisu Classico",
        price: 11.99,
        description: "House-baked ladyfingers soaked in espresso, layered with whipped mascarpone cream.",
        photoUrl: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Desserts'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
      {
        title: "Seared Atlantic Salmon",
        price: 28.99,
        description: "Crispy skin salmon fillet resting on braised asparagus, drizzled with dill lemon glaze.",
        photoUrl: "https://images.unsplash.com/photo-1485921325814-a5341f61173c?q=80&w=400&auto=format&fit=crop",
        category: categoryMap['Meat & Seafood'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Handmade Squid Ink Tagliolini",
        description: "Squid ink pasta tossed with calamari, cherry tomatoes, white wine, garlic, and chili.",
        price: 27.99,
        photoUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop",
        category: categoryMap['Pasta & Risotto'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Wood-Fired Honey Fig Prosciutto Pizza",
        description: "Caramelized black mission figs, salty Parma ham, gorgonzola cheese, wild arugula, and dark honey drizzle.",
        price: 22.99,
        photoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
        category: categoryMap['Wood-Fired Pizzas'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Rosemary Infused Venison Tenderloin",
        description: "Pan-roasted wild venison medallion with juniper berry glaze, parsnip mash, and roasted baby carrots.",
        price: 45.99,
        photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop",
        category: categoryMap['Meat & Seafood'],
        dietaryAttributes: { isVegetarian: false, isVegan: false },
      },
      {
        title: "Cardamom Panna Cotta",
        description: "Velvety cream panna cotta flavored with fresh green cardamom, topped with blood orange reduction.",
        price: 13.99,
        photoUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop",
        category: categoryMap['Desserts'],
        dietaryAttributes: { isVegetarian: true, isVegan: false },
      },
    ];

    const createdItems = await Item.insertMany(itemsData);
    console.log(`Added ${createdItems.length} items.`);

    // Add Specials
    const specialData = [
      { item: createdItems[8]._id, date: new Date() },
      { item: createdItems[9]._id, date: new Date() },
      { item: createdItems[10]._id, date: new Date() },
      { item: createdItems[11]._id, date: new Date() },
    ];
    await Special.insertMany(specialData);
    console.log(`Added ${specialData.length} Specials.`);

    // Create Chefs
    const chefsData = [
      {
        name: "Chef Marco Pierre",
        role: "Executive Culinary Director",
        bio: "With over 18 years in Michelin-starred establishments, Chef Marco merges ancient wood-fire grilling methods with boundary-pushing molecular gastronomy to craft unforgettable tastes.",
        photoUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop",
        specialties: ["Artisanal Sourdough", "Dry-Aged Meats", "Plating Artistry"],
        experienceYears: 18,
      },
      {
        name: "Chef Elena Rostova",
        role: "Head Pastry Artist",
        bio: "Elena elevates pastry creation to visual masterwork. Her desserts balance texture and subtle cardamon, saffron elements, ensuring a grand and sweet conclusion to your culinary journey.",
        photoUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop",
        specialties: ["French Macarons", "Tempered Chocolate", "Sourdough Crûst"],
        experienceYears: 12,
      },
      {
        name: "Chef Kenji Tanaka",
        role: "Master of Grills & Fire",
        bio: "Tanaka is a fire sculptor. He oversees our live wood-burning hearth, orchestrating the precise levels of smoke, heat, and ash that give Slice 'n Spice its distinctive trademark flavor.",
        photoUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
        specialties: ["Hardwood Selection", "Smoked Infusions", "Seafood Sear"],
        experienceYears: 14,
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
