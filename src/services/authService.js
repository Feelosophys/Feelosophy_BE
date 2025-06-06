// src/services/authService.js
// Handles user registration, login, password hashing, JWT
const User = require('../models/User');
const {
    hashPassword,
    comparePassword
} = require('../config/encoderConfig');
const {
    generateToken
} = require('../config/jwtAuthConfig');
const AppError = require('../utils/customError');

exports.register = async ({
    name,
    email,
    password
}) => {
    const existing = await User.findOne({
        email
    });
    if (existing) throw new AppError('Email already in use', 400);
    const hashed = await hashPassword(password);
    const user = await User.create({
        name,
        email,
        password: hashed
    });
    const token = generateToken({
        id: user._id,
        role: user.role
    });
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};

exports.login = async ({
    email,
    password
}) => {
    const user = await User.findOne({
        email
    }).select('+password');
    if (!user || !(await comparePassword(password, user.password))) {
        throw new AppError('Invalid credentials', 401);
    }
    const token = generateToken({
        id: user._id,
        role: user.role
    });
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token
    };
};