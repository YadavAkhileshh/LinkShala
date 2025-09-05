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
    enum: ['tools', 'ui-libraries', 'backgrounds', 'icons', 'learning']
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
  },
  publishedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

linkSchema.index({ title: 'text', description: 'text', tags: 'text' });
linkSchema.index({ category: 1 });
linkSchema.index({ isActive: 1 });

export default mongoose.model('Link', linkSchema);