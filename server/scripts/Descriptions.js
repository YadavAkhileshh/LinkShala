import mongoose from 'mongoose';
import Link from '../models/Link.js';
import dotenv from 'dotenv';

dotenv.config();

const updateDescriptions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Update all links that don't have a description or have null/undefined description
    const result = await Link.updateMany(
      { 
        $or: [
          { description: { $exists: false } },
          { description: null },
          { description: undefined }
        ]
      },
      { 
        $set: { description: '' }
      }
    );

    console.log(`Updated ${result.modifiedCount} links with empty descriptions`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error updating descriptions:', error);
    process.exit(1);
  }
};

updateDescriptions();