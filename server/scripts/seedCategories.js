import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';

dotenv.config();

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Default categories
    const defaultCategories = [
      { name: 'UI Libraries' },
      { name: 'Backgrounds' },
      { name: 'Icons' },
      { name: 'Learning' },
      { name: 'Tools' },
      { name: 'Design' },
      { name: 'Development' },
      { name: 'Resources' }
    ];

    // Create categories
    const createdCategories = await Category.insertMany(defaultCategories);
    console.log(`Created ${createdCategories.length} categories:`);
    createdCategories.forEach(cat => {
      console.log(`- ${cat.name} (slug: ${cat.slug})`);
    });

    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedCategories();