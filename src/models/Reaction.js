const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
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
  type: {
    type: String,
    enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
    required: true
  },
}, {
  timestamps: true
});

// Virtual for dynamic ref
reactionSchema.virtual('post', {
  ref: function () {
    return this.postType === 'forum' ? 'Forum' : 'Post';
  },
  localField: 'postId',
  foreignField: '_id',
  justOne: true
});

module.exports = mongoose.model('Reaction', reactionSchema);