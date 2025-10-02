// src/controllers/authController.js
// Handles register and login
const authService = require('../services/authService');
const {
    successResponse
} = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 */
exports.register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    successResponse(res, 201, result, 'User registered');
});

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
exports.login = catchAsync(async (req, res) => {
    const result = await authService.login(req.body);
    successResponse(res, 200, result, 'Login successful');
});

exports.logout = catchAsync(async (req, res) => {
    const {
        refreshToken
    } = req.body;
    const result = await authService.logout(refreshToken);
    successResponse(res, 200, result, 'Logout successful');
});

/**
 * @swagger
 * /api/v1/auth/refresh-token:
 *   post:
 *     summary: Refresh JWT access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 */
exports.refreshToken = catchAsync(async (req, res) => {
    const {
        refreshToken
    } = req.body;
    const result = await authService.refreshToken(refreshToken);
    successResponse(res, 200, result, 'Token refreshed');
});

/**
 * @swagger
 * /api/v1/auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed
 */
exports.changePassword = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const {
        oldPassword,
        newPassword
    } = req.body;
    const result = await authService.changePassword({
        userId,
        oldPassword,
        newPassword
    });
    successResponse(res, 200, result, 'Password changed');
});

/**
 * @swagger
 * /api/v1/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Google login successful
 */
exports.googleAuthCallback = catchAsync(async (req, res) => {
    const user = req.user;
    const {
        accessToken,
        refreshToken,
        user: sanitizedUser
    } = await authService.generateTokenForUser(user);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const url = new URL(`${frontendUrl}/auth/callback`);
    url.searchParams.set('accessToken', accessToken);
    url.searchParams.set('refreshToken', refreshToken);
    if (sanitizedUser) {
        const encodedUser = Buffer.from(JSON.stringify(sanitizedUser)).toString('base64url');
        url.searchParams.set('user', encodedUser);
    }

    res.redirect(url.toString());
});