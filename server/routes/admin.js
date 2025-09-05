import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Link from '../models/Link.js';
import Category from '../models/Category.js';


const router = express.Router();

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token.' });
  }
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all links (including inactive)
router.get('/links', authenticateAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const links = await Link.find()
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Link.countDocuments();
    
    res.json({
      links,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// URL normalization helper
const normalizeUrl = (url) => {
  if (!url) return '';
  const trimmedUrl = url.trim();
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }
  return `https://${trimmedUrl}`;
};

// Create new link
router.post('/links', authenticateAdmin, async (req, res) => {
  try {
    const linkData = {
      ...req.body,
      url: normalizeUrl(req.body.url),
      description: req.body.description || ''
    };
    const link = new Link(linkData);
    await link.save();
    res.status(201).json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update link
router.put('/links/:id', authenticateAdmin, async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      url: req.body.url ? normalizeUrl(req.body.url) : undefined
    };
    
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json(link);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete link
router.delete('/links/:id', authenticateAdmin, async (req, res) => {
  try {
    const link = await Link.findByIdAndDelete(req.params.id);
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Link deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Bulk create links
router.post('/links/bulk', authenticateAdmin, async (req, res) => {
  try {
    const { links } = req.body;
    
    if (!Array.isArray(links)) {
      return res.status(400).json({ error: 'Links must be an array' });
    }
    
    const processedLinks = links.map(link => ({
      ...link,
      url: normalizeUrl(link.url),
      description: link.description || ''
    }));
    
    const createdLinks = await Link.insertMany(processedLinks);
    res.status(201).json({
      message: `${createdLinks.length} links created successfully`,
      links: createdLinks
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Generate metadata for a link
router.post('/generate-metadata', authenticateAdmin, async (req, res) => {
  try {
    const { name, url } = req.body;
    
    if (!name || !url) {
      return res.status(400).json({ error: 'Name and URL are required' });
    }
    
    const metadata = await geminiService.generateLinkMetadata(name, url);
    res.json(metadata);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', authenticateAdmin, async (req, res) => {
  try {
    const totalLinks = await Link.countDocuments();
    const activeLinks = await Link.countDocuments({ isActive: true });
    const totalClicks = await Link.aggregate([
      { $group: { _id: null, total: { $sum: '$clickCount' } } }
    ]);
    const totalShares = await Link.aggregate([
      { $group: { _id: null, total: { $sum: '$shareCount' } } }
    ]);
    
    const categoryStats = await Link.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const topLinks = await Link.find({ isActive: true })
      .sort({ clickCount: -1 })
      .limit(5)
      .select('title url clickCount shareCount');
    
    res.json({
      totalLinks,
      activeLinks,
      totalClicks: totalClicks[0]?.total || 0,
      totalShares: totalShares[0]?.total || 0,
      categoryStats,
      topLinks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Category CRUD operations

// Get all categories
router.get('/categories', authenticateAdmin, async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Get link count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const linkCount = await Link.countDocuments({ category: category.slug });
        return {
          ...category.toObject(),
          linkCount
        };
      })
    );
    
    res.json(categoriesWithCount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new category
router.post('/categories', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const category = new Category({ name });
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Update category
router.put('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Category name already exists' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete category
router.delete('/categories/:id', authenticateAdmin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if category is being used by any links
    const linkCount = await Link.countDocuments({ category: category.slug });
    
    if (linkCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. ${linkCount} links are using this category.` 
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;