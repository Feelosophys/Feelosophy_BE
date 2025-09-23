const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  postType: {
    type: String,
    enum: ['post', 'forum'],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
}, {
  timestamps: true
});

// Virtual for dynamic ref
commentSchema.virtual('post', {
  ref: function () {
    return this.postType === 'forum' ? 'Forum' : 'Post';
  },
  localField: 'postId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Comment', commentSchema);