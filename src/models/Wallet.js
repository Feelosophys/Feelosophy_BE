const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  reason: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  _id: false
});

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  transactions: [transactionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Wallet', walletSchema);