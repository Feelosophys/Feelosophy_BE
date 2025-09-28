const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    trim: true
  },
  verified: {
    type: Boolean,
    default: false
  },
}, {
  timestamps: true
});

// Virtual for studentName (from populated user)
feedbackSchema.virtual('studentName').get(function () {
  return this.userId ? this.userId.name : '';
});

// Virtual for avatar (from populated user)
feedbackSchema.virtual('avatar').get(function () {
  return this.userId ? this.userId.avatar : '';
});

// Virtual for date (use createdAt)
feedbackSchema.virtual('date').get(function () {
  return this.createdAt;
});

// Ensure virtual fields are serialized
feedbackSchema.set('toJSON', {
  virtuals: true
});
feedbackSchema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model('Feedback', feedbackSchema);