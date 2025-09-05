import mongoose from 'mongoose';
import Link from '../models/Link.js';
import dotenv from 'dotenv';

dotenv.config();

const updateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update old category names to new ones
    const updates = [
      { old: 'ui', new: 'ui-libraries' }
    ];

    for (const update of updates) {
      const result = await Link.updateMany(
        { category: update.old },
        { $set: { category: update.new } }
      );
      console.log(`Updated ${result.modifiedCount} links from '${update.old}' to '${update.new}'`);
    }

    console.log('Category update completed');
    process.exit(0);
  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
};

updateCategories();