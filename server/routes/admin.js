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

// Admin login - optimized for speed
router.post('/login', (req, res) => {
  try {
    const { password } = req.body;
    
    // Direct comparison for speed
    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
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
    if (!req.body.title || !req.body.url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }
    
    const normalizedUrl = normalizeUrl(req.body.url);
    
    const existingLink = await Link.findOne({ url: normalizedUrl });
    if (existingLink) {
      return res.status(400).json({ error: 'A link with this URL already exists' });
    }
    
    let categorySlug = 'tools';
    
    if (req.body.category) {
      const categoryName = req.body.category.trim();
      const categorySlugTemp = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      let category = await Category.findOne({ slug: categorySlugTemp });
      
      if (!category) {
        category = new Category({ name: categoryName });
        await category.save();
      }
      
      categorySlug = category.slug;
    }
    
    const linkData = {
      title: req.body.title.trim(),
      url: normalizedUrl,
      description: req.body.description || '',
      category: categorySlug,
      tags: Array.isArray(req.body.tags) ? req.body.tags : (req.body.tags ? req.body.tags.split(',').map(t => t.trim()) : []),
      publishedDate: req.body.publishedDate ? new Date(req.body.publishedDate) : new Date(),
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      isFeatured: req.body.isFeatured !== undefined ? req.body.isFeatured : false,
      isPromoted: req.body.isPromoted !== undefined ? req.body.isPromoted : false
    };
    
    const link = new Link(linkData);
    await link.save();
    res.status(201).json(link);
  } catch (error) {
    console.error('Link creation error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A link with this URL already exists' });
    }
    res.status(400).json({ 
      error: 'Failed to create link',
      details: error.message 
    });
  }
});

// Update link
router.put('/links/:id', authenticateAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    if (req.body.url) {
      const normalizedUrl = normalizeUrl(req.body.url);
      
      // Check if URL is being changed and if new URL already exists
      const existingLink = await Link.findOne({ 
        url: normalizedUrl,
        _id: { $ne: req.params.id }
      });
      
      if (existingLink) {
        return res.status(400).json({ error: 'A link with this URL already exists' });
      }
      
      updateData.url = normalizedUrl;
    }
    
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
    if (error.code === 11000) {
      return res.status(400).json({ error: 'A link with this URL already exists' });
    }
    res.status(400).json({ error: error.message });
  }
});

// Bulk delete links
router.post('/links/delete-bulk', authenticateAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No link IDs provided' });
    }
    
    const result = await Link.deleteMany({ _id: { $in: ids } });
    
    res.json({ 
      message: `${result.deletedCount} links deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.post('/links/create-bulk', authenticateAdmin, async (req, res) => {
  try {
    const { links } = req.body;
    
    if (!Array.isArray(links)) {
      return res.status(400).json({ error: 'Links must be an array' });
    }
    
    if (links.length === 0) {
      return res.status(400).json({ error: 'No links provided' });
    }
    
    const processedLinks = [];
    const errors = [];
    const skipped = [];
    const createdCategories = [];
    
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      
      if (!link.title || !link.url) {
        errors.push(`Link ${i + 1}: Title and URL are required`);
        continue;
      }
      
      const normalizedUrl = normalizeUrl(link.url);
      
      const existingLink = await Link.findOne({ url: normalizedUrl });
      if (existingLink) {
        skipped.push(`Link ${i + 1} (${link.title}): URL already exists`);
        continue;
      }
      
      let categorySlug = 'tools';
      
      if (link.category) {
        const categoryName = link.category.trim();
        const categorySlugTemp = categoryName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        // Check if category exists (case-insensitive)
        let category = await Category.findOne({ slug: categorySlugTemp });
        
        if (!category) {
          // Create new category
          category = new Category({ name: categoryName });
          await category.save();
          createdCategories.push(categoryName);
        }
        
        categorySlug = category.slug;
      }
      
      processedLinks.push({
        title: link.title.trim(),
        url: normalizedUrl,
        description: link.description || '',
        category: categorySlug,
        tags: Array.isArray(link.tags) ? link.tags : (link.tags ? link.tags.split(',').map(t => t.trim()) : []),
        publishedDate: link.publishedDate ? new Date(link.publishedDate) : new Date(),
        isActive: link.isActive !== undefined ? link.isActive : true,
        isFeatured: link.isFeatured !== undefined ? link.isFeatured : false,
        isPromoted: link.isPromoted !== undefined ? link.isPromoted : false
      });
    }
    
    if (processedLinks.length === 0) {
      return res.status(400).json({ 
        error: 'No valid links to create',
        details: [...errors, ...skipped],
        processed: 0,
        total: links.length
      });
    }
    
    const createdLinks = await Link.insertMany(processedLinks, { ordered: false });
    
    const response = {
      message: `${createdLinks.length} links created successfully`,
      created: createdLinks.length,
      total: links.length,
      links: createdLinks
    };
    
    if (createdCategories.length > 0) {
      response.newCategories = createdCategories;
    }
    
    if (skipped.length > 0) {
      response.skipped = skipped.length;
      response.skippedDetails = skipped;
    }
    
    if (errors.length > 0) {
      response.errors = errors;
    }
    
    res.status(201).json(response);
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(400).json({ 
      error: 'Failed to create links',
      details: error.message,
      code: error.code
    });
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
    
    const oldCategory = await Category.findById(req.params.id);
    if (!oldCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const oldSlug = oldCategory.slug;
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true }
    );
    
    // Update all links with the old slug to use the new slug
    if (oldSlug !== category.slug) {
      await Link.updateMany(
        { category: oldSlug },
        { category: category.slug }
      );
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

// Move links to different category
router.post('/links/move-category', authenticateAdmin, async (req, res) => {
  try {
    const { linkIds, targetCategory } = req.body;
    
    if (!Array.isArray(linkIds) || linkIds.length === 0) {
      return res.status(400).json({ error: 'No link IDs provided' });
    }
    
    if (!targetCategory) {
      return res.status(400).json({ error: 'Target category is required' });
    }
    
    // Verify target category exists
    const category = await Category.findOne({ slug: targetCategory });
    if (!category) {
      return res.status(404).json({ error: 'Target category not found' });
    }
    
    const result = await Link.updateMany(
      { _id: { $in: linkIds } },
      { category: targetCategory }
    );
    
    res.json({ 
      message: `${result.modifiedCount} links moved to ${category.name}`,
      movedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Find and remove duplicate links
router.post('/links/remove-duplicates', authenticateAdmin, async (req, res) => {
  try {
    // Find duplicate URLs
    const duplicateUrls = await Link.aggregate([
      { $group: { _id: '$url', count: { $sum: 1 }, ids: { $push: '$_id' } } },
      { $match: { count: { $gt: 1 } } }
    ]);
    
    let removedCount = 0;
    const removedLinks = [];
    
    // For each duplicate URL, keep the oldest one and remove others
    for (const dup of duplicateUrls) {
      const links = await Link.find({ _id: { $in: dup.ids } }).sort({ createdAt: 1 });
      
      // Keep first (oldest), remove rest
      for (let i = 1; i < links.length; i++) {
        removedLinks.push({ title: links[i].title, url: links[i].url });
        await Link.findByIdAndDelete(links[i]._id);
        removedCount++;
      }
    }
    
    res.json({
      message: `Removed ${removedCount} duplicate links`,
      removedCount,
      duplicatesFound: duplicateUrls.length,
      removedLinks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;