const mongoose = require('mongoose');

const TeacherSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specialization: [{
        type: String,
        trim: true
    }],
    experience: {
        type: String,
        trim: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: {
        type: Number,
        default: 0,
        min: 0
    },
    price: {
        type: Number,
        min: 0
    },
    bio: {
        type: String,
        trim: true
    },
    availability: [{
        type: String,
        trim: true
    }],
    expertise: [{ // Keep for backward compatibility
        type: String,
        trim: true
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', TeacherSchema);