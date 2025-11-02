import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  url: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: function(v) {
        // Allow any non-empty string - we'll normalize it in the application
        return v && v.length > 0;
      },
      message: 'URL is required'
    }
  },
  description: {
    type: String,
    required: false,
    trim: true,
    default: ''
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  clickCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  },
  publishedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Text search index
linkSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Compound indexes for common queries
linkSchema.index({ isActive: 1, createdAt: -1 });
linkSchema.index({ isActive: 1, category: 1, createdAt: -1 });
linkSchema.index({ category: 1, isActive: 1 });
linkSchema.index({ isFeatured: 1, isActive: 1 });
linkSchema.index({ clickCount: -1 });
linkSchema.index({ shareCount: -1 });

export default mongoose.model('Link', linkSchema);