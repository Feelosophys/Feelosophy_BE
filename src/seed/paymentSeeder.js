// scripts/seedPayments.js
const mongoose = require('mongoose');
const Payment = require('../models/Payment');

const MONGODB_URI = 'mongodb+srv://root:123@truongcluster.nq3ga4g.mongodb.net/feelosophy?retryWrites=true&w=majority&appName=truongcluster';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error:', err));

// Dữ liệu mẫu cho Payment
const samplePayments = [
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
    userId: new mongoose.Types.ObjectId('68dea82cc85322501bf66c1b'), // Thay bằng _id thật từ users
    courseId: new mongoose.Types.ObjectId('68dea55a08e226c9eb4d96fe'), // Thay bằng _id thật từ courses
    amount: 2000000,
    method: 'credit_card',
    status: 'paid',
    createdAt: new Date('2025-10-15T00:00:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012'),
    userId: new mongoose.Types.ObjectId('68dea82cc85322501bf66c1b'),
    courseId: new mongoose.Types.ObjectId('68dea55a08e226c9eb4d9719'),
    amount: 100000,
    method: 'bank_transfer',
    status: 'paid',
    createdAt: new Date('2025-10-12T00:00:00.000Z')
  },
  {
    _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439013'),
    userId: new mongoose.Types.ObjectId('68fa3bf2184f592cb042e9cd'),
    courseId: new mongoose.Types.ObjectId('68e981af8689cde2ff5bf302'),
    amount: 100000,
    method: 'credit_card',
    status: 'paid',
    createdAt: new Date('2025-10-15T00:00:00.000Z')
  }
];

// Xóa collection payments cũ (tùy chọn, bỏ comment nếu muốn xóa dữ liệu cũ)
// Payment.deleteMany({})
//   .then(() => console.log('Cleared old payments'))
//   .catch(err => console.error('Error clearing payments:', err));

// Insert dữ liệu mẫu
Payment.insertMany(samplePayments)
  .then(() => console.log('Inserted sample payments'))
  .catch(err => console.error('Error inserting payments:', err));

// Đóng kết nối sau 5 giây
setTimeout(() => {
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}, 5000);