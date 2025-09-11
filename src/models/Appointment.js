// src/models/Appointment.js
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  workingHourId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkingHour',
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String,
    enum: ['booked', 'completed', 'cancelled'],
    default: 'booked'
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);