// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId; // Password required unless Google auth
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String,
    trim: true
  },
  title: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  website: {
    type: String,
    trim: true
  },
  socialLinks: {
    facebook: {
      type: String,
      trim: true
    },
    twitter: {
      type: String,
      trim: true
    },
    linkedin: {
      type: String,
      trim: true
    },
    instagram: {
      type: String,
      trim: true
    }
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'teacher'],
    default: 'user'
  },
  roles: {
    type: [String],
    enum: ['admin', 'user', 'teacher'],
    default: ['user']
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  coursesEnrolled: {
    type: Number,
    default: 0,
    min: 0
  },
  coursesCompleted: {
    type: Number,
    default: 0,
    min: 0
  },
  totalSpent: {
    type: Number,
    default: 0,
    min: 0
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Wallet'
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  },
}, {
  timestamps: true
});

// Virtual for joinedDate
userSchema.virtual('joinedDate').get(function () {
  return this.createdAt ? this.createdAt.toISOString().split('T')[0] : null;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true
});
userSchema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model('User', userSchema);