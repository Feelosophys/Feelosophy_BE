// src/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  students: {
    type: Number,
    default: 0,
    min: 0
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructorImage: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['Mental Health', 'Wellness', 'Therapy', 'Self-Care'],
    required: true
  },
  ageRange: {
    type: String,
    enum: ['children', 'teenagers', 'adults'],
    required: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  objectives: [{
    type: String,
    trim: true
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  curriculum: [{
    type: String,
    trim: true
  }],
  reviews: [{
    studentName: {
      type: String,
      required: true,
      trim: true
    },
    avatar: {
      type: String,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    verified: {
      type: Boolean,
      default: false
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  courseDuration: {
    type: String,
    required: true,
    trim: true
  },
  courseType: {
    type: String,
    enum: ['individual', 'group', 'corporate'],
    required: true
  },
  features: [{
    type: String,
    trim: true
  }],
  corporateFeatures: [{
    type: String,
    trim: true
  }],
  minParticipants: {
    type: Number,
    min: 1
  },
  maxParticipants: {
    type: Number,
    min: 1
  },
  totalHours: {
    type: Number,
    required: true,
    min: 0
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  enrolledUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for lessons count
courseSchema.virtual('lessonsCount').get(function () {
  return this.lessons.length;
});

// Ensure virtual fields are serialized
courseSchema.set('toJSON', {
  virtuals: true
});
courseSchema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model('Course', courseSchema);