// src/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  bio: {
    type: String
  },
  roles: [{
    type: String,
    enum: ['user', 'instructor', 'teacher', 'organization', 'admin'],
    default: 'user'
  }],
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

module.exports = mongoose.model('User', userSchema);