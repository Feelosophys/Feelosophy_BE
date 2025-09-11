const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
  amount: {
    type: Number,
    required: true
  },
  method: {
    type: String
  },
  voucherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Voucher'
  },
  status: {
    type: String,
    enum: ['paid', 'failed', 'refunded'],
    default: 'paid'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);