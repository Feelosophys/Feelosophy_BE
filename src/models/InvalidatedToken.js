const mongoose = require('mongoose');

const invalidatedTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  invalidatedAt: {
    type: Date,
    default: Date.now
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('InvalidatedToken', invalidatedTokenSchema);