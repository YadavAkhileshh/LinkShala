import mongoose from 'mongoose';
import Link from '../models/Link.js';
import dotenv from 'dotenv';

dotenv.config();

// Sample data to populate MongoDB
const sampleLinks = [
  {
    title: "Tabler Icons",
    url: "https://tabler-icons.io/",
    category: "icons",
    tags: ["icons", "svg", "free", "open-source"],
    isActive: true
  },
  {
    title: "Unsplash",
    url: "https://unsplash.com/",
    category: "backgrounds",
    tags: ["photos", "free", "high-quality", "stock"],
    isActive: true
  },
  {
    title: "Tailwind CSS",
    url: "https://tailwindcss.com/",
    category: "ui-libraries",
    tags: ["css", "framework", "utility-first", "responsive"],
    isActive: true
  },
  {
    title: "MDN Web Docs",
    url: "https://developer.mozilla.org/",
    category: "learning",
    tags: ["documentation", "web", "javascript", "html", "css"],
    isActive: true
  },
  {
    title: "Figma",
    url: "https://www.figma.com/",
    category: "tools",
    tags: ["design", "prototyping", "collaboration", "ui-ux"],
    isActive: true
  },
  {
    title: "React",
    url: "https://reactjs.org/",
    category: "ui-libraries",
    tags: ["javascript", "library", "components", "frontend"],
    isActive: true
  },
  {
    title: "Heroicons",
    url: "https://heroicons.com/",
    category: "icons",
    tags: ["icons", "svg", "tailwind", "free"],
    isActive: true
  },
  {
    title: "Gradient Hunt",
    url: "https://gradienthunt.com/",
    category: "backgrounds",
    tags: ["gradients", "colors", "css", "design"],
    isActive: true
  },
  {
    title: "FreeCodeCamp",
    url: "https://www.freecodecamp.org/",
    category: "learning",
    tags: ["coding", "tutorials", "free", "certification"],
    isActive: true
  },
  {
    title: "VS Code",
    url: "https://code.visualstudio.com/",
    category: "tools",
    tags: ["editor", "ide", "microsoft", "extensions"],
    isActive: true
  }
];

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Link.deleteMany({});
    console.log('Cleared existing links');

    // Insert sample data
    await Link.insertMany(sampleLinks);
    console.log(`Inserted ${sampleLinks.length} sample links`);

    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateData();