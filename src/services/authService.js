const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
    hashPassword,
    comparePassword
} = require('../config/encoderConfig');
const jwtConfig = require('../config/jwtAuthConfig');
const AppError = require('../utils/customError');

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role || 'user',
    roles: user.roles || [user.role || 'user'],
    avatar: user.avatar || null,
    title: user.title || null,
    isVerified: user.isVerified,
});

const createRefreshTokenRecord = async (userId, token) => {
    await RefreshToken.deleteMany({
        userId
    });

    await RefreshToken.create({
        userId,
        token,
        expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    });
};

const buildAuthResponse = async (user) => {
    const accessToken = jwtConfig.generateToken({
        id: user._id,
        roles: user.roles
    });
    const refreshToken = jwtConfig.generateRefreshToken(user._id);

    await createRefreshTokenRecord(user._id, refreshToken);

    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken
    };
};

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

    return buildAuthResponse(user);
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

    return buildAuthResponse(user);
};

exports.refreshToken = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
    }

    const tokenRecord = await RefreshToken.findOne({
        token: refreshToken
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
        if (tokenRecord) {
            await tokenRecord.deleteOne();
        }
        throw new AppError('Refresh token invalid or expired', 401);
    }

    let payload;
    try {
        payload = jwtConfig.verifyRefreshToken(refreshToken);
    } catch (error) {
        await tokenRecord.deleteOne();
        throw new AppError('Refresh token invalid or expired', 401);
    }

    const user = await User.findById(payload.id);
    if (!user) {
        await tokenRecord.deleteOne();
        throw new AppError('User not found', 404);
    }

    const accessToken = jwtConfig.generateToken({
        id: user._id,
        roles: user.roles
    });
    const newRefreshToken = jwtConfig.generateRefreshToken(user._id);

    tokenRecord.token = newRefreshToken;
    tokenRecord.expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
    await tokenRecord.save();

    return {
        user: sanitizeUser(user),
        accessToken,
        refreshToken: newRefreshToken
    };
};

exports.logout = async (refreshToken) => {
    if (!refreshToken) {
        throw new AppError('Refresh token is required', 400);
    }

    await RefreshToken.deleteOne({
        token: refreshToken
    });

    return {
        message: 'Logged out successfully'
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

exports.generateTokenForUser = async (user) => buildAuthResponse(user);