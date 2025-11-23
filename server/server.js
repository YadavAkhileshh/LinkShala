import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import linksRouter from './routes/links.js';
import adminRouter from './routes/admin.js';
import telegramRouter from './routes/telegram.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Trust proxy
app.set('trust proxy', 1);

// Security middleware - Helmet with strict CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true
}));

// CORS - Allow all origins (public API)
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log requests in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// Anti-scraping middleware (skip for telegram route)
app.use((req, res, next) => {
  // Allow telegram route to make axios requests
  if (req.path.startsWith('/api/telegram')) {
    return next();
  }
  
  const userAgent = req.get('user-agent') || '';
  const blockedAgents = [
    'scrapy', 'crawler', 'spider', 'bot', 'scraper',
    'curl', 'wget', 'python-requests', 'postman'
  ];
  
  const isBlocked = blockedAgents.some(agent => 
    userAgent.toLowerCase().includes(agent.toLowerCase())
  );
  
  if (isBlocked && !userAgent.toLowerCase().includes('googlebot') && !userAgent.toLowerCase().includes('bingbot')) {
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
});

// Rate limiting - Very strict for public endpoints
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per 15 min
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path.startsWith('/api/admin')
});
app.use('/api/links', publicLimiter);

// Admin login rate limiting - Prevent brute force
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per 15 min
  message: { error: 'Too many login attempts, please try again later.' },
  skipSuccessfulRequests: true
});
app.use('/api/admin/login', adminLoginLimiter);

// Admin operations rate limiting
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/admin', adminLimiter);

// Body parsing middleware with size limits
app.use(express.json({ limit: '1mb' })); // Reduced from 10mb
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Prevent parameter pollution
app.use((req, res, next) => {
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (Array.isArray(req.query[key])) {
        req.query[key] = req.query[key][0];
      }
    });
  }
  next();
});

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/links', linksRouter);
app.use('/api/admin', adminRouter);
app.use('/api/telegram', telegramRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});