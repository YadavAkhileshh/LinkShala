import express from 'express';
import Link from '../models/Link.js';
import Category from '../models/Category.js';
import aiDescriptionService from '../services/aiDescriptionService.js';

const router = express.Router();

// Get categories with counts (public endpoint) - MUST come before /:id route
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Get total active links count
    const totalActiveLinks = await Link.countDocuments({ isActive: true });
    
    // Get all active links grouped by category
    const linkCounts = await Link.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const countMap = {};
    linkCounts.forEach(item => {
      countMap[item._id] = item.count;
    });
    
    const categoriesWithCount = categories.map(category => ({
      ...category.toObject(),
      linkCount: countMap[category.slug] || 0
    }));
    
    res.json({ categories: categoriesWithCount, totalActiveLinks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all links with filtering and search (optimized)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 500 } = req.query;
    const query = { isActive: true };
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$text = { $search: search };
    }
    
    const links = await Link.find(query)
      .sort(search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();
    
    const total = await Link.countDocuments(query);
    
    res.set('Cache-Control', 'public, max-age=300');
    
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

// Get single link and increment click count
router.get('/:id', async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { clickCount: 1 } },
      { new: true }
    );
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Generate description if missing
    if (!link.description) {
      try {
        const description = await aiDescriptionService.generateDescription(link.title, link.url);
        link.description = description;
        await link.save();
      } catch (error) {
        console.log('Failed to generate description:', error);
      }
    }
    
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Increment share count
router.post('/:id/share', async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { shareCount: 1 } },
      { new: true }
    );
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Share count updated', shareCount: link.shareCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track referral clicks (ref=linkshala)
router.post('/:id/referral', async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { referralCount: 1 } },
      { new: true }
    );
    
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    res.json({ message: 'Referral tracked', referralCount: link.referralCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// Get categories with counts (legacy endpoint)
router.get('/stats/categories', async (req, res) => {
  try {
    const stats = await Link.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;