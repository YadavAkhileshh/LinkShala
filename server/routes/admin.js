import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Link from '../models/Link.js';


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

export default router;