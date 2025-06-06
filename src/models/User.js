// src/models/User.js
const mongoose = require('mongoose');
const {
    USER,
    ADMIN
} = require('../constants/roles');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 6
    },
    role: {
        type: String,
        enum: [USER, ADMIN],
        default: USER
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);