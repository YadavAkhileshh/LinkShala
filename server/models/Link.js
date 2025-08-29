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
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['ui', 'backgrounds', 'icons', 'learning', 'tools']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  clickCount: {
    type: Number,
    default: 0
  },
  shareCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

linkSchema.index({ title: 'text', description: 'text', tags: 'text' });
linkSchema.index({ category: 1 });
linkSchema.index({ isActive: 1 });

export default mongoose.model('Link', linkSchema);