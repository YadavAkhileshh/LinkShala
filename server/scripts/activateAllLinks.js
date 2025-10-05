import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Link from '../models/Link.js';

dotenv.config();

async function activateAllLinks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const result = await Link.updateMany(
      { isActive: { $ne: true } },
      { $set: { isActive: true } }
    );

    console.log(`Activated ${result.modifiedCount} links`);
    
    const totalActive = await Link.countDocuments({ isActive: true });
    console.log(`Total active links: ${totalActive}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

activateAllLinks();
