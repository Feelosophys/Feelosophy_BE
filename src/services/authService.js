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

const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtAuthConfig');

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

    const accessToken = jwtConfig.generateToken({
        id: user._id,
        role: user.role
    });

    const refreshToken = jwtConfig.generateRefreshToken(user._id);

    await RefreshToken.create({
        userId: user._id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken,
        refreshToken
    };
};

exports.refreshToken = async (refreshToken) => {
    const found = await RefreshToken.findOne({
        token: refreshToken
    });
    if (!found || found.expiresAt < new Date()) {
        throw new AppError('Refresh token invalid or expired', 401);
    }

    const payload = jwtConfig.verifyToken(refreshToken);

    const user = await User.findById(payload.id);
    if (!user) throw new AppError('User not found', 404);

    const accessToken = jwtConfig.generateToken({
        id: user._id,
        role: user.role
    });

    return {
        accessToken
    };
};

exports.changePassword = async ({
    userId,
    oldPassword,
    newPassword
}) => {
    const user = await User.findById(userId).select('+password');
    if (!user) throw new AppError('User not found', 404);
    if (!(await comparePassword(oldPassword, user.password))) {
        throw new AppError('Old password is incorrect', 400);
    }
    user.password = await hashPassword(newPassword);
    await user.save();
    return {
        message: 'Password changed successfully'
    };
};