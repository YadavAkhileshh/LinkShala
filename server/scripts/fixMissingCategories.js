import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Link from '../models/Link.js';
import Category from '../models/Category.js';

dotenv.config();

async function fixMissingCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find links without category or with empty category
    const linksWithoutCategory = await Link.find({
      $or: [
        { category: { $exists: false } },
        { category: null },
        { category: '' }
      ]
    });

    console.log(`Found ${linksWithoutCategory.length} links without categories`);

    if (linksWithoutCategory.length === 0) {
      console.log('All links have categories!');
      process.exit(0);
    }

    // Ensure 'tools' category exists
    let toolsCategory = await Category.findOne({ slug: 'tools' });
    if (!toolsCategory) {
      toolsCategory = new Category({ name: 'Tools' });
      await toolsCategory.save();
      console.log('Created default "Tools" category');
    }

    // Update all links without category to use 'tools'
    const result = await Link.updateMany(
      {
        $or: [
          { category: { $exists: false } },
          { category: null },
          { category: '' }
        ]
      },
      { $set: { category: 'tools' } }
    );

    console.log(`Updated ${result.modifiedCount} links to use "tools" category`);
    console.log('Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixMissingCategories();
