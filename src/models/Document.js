const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  lessonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson',
    required: true
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);