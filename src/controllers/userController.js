// src/controllers/userController.js
const userService = require('../services/userService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const {
    validationResult
} = require('express-validator');

class UserController {
    // GET /api/v1/users
    getAllUsers = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed');
        }
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search
        };
        const result = await userService.getAllUsers(options);
        return ApiResponse.successResponse(res, 200, result, 'Users retrieved successfully');
    });

    // GET /api/v1/users/:id
    getUserById = catchAsync(async (req, res) => {
        const {
            id
        } = req.params;
        const user = await userService.getUserById(id);
        return ApiResponse.successResponse(res, 200, user, 'User retrieved successfully');
    });

    // GET /api/v1/users/profile - Get current user profile
    getCurrentUserProfile = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const userId = req.user.id; // From JWT token
        const user = await userService.getCurrentUserProfile(userId);

        return ApiResponse.successResponse(res, 200, user, 'Current user profile retrieved successfully');
    });

    // PUT /api/v1/users/profile - Update current user profile
    updateProfile = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const userId = req.user.id; // From JWT token
        const updateData = req.body;

        const updatedUser = await userService.updateUserProfile(userId, updateData);
        return ApiResponse.successResponse(res, 200, updatedUser, 'Profile updated successfully');
    });

    // GET /api/v1/users/:userId/courses - Get user's enrolled courses
    getUserCourses = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const {
            userId
        } = req.params;
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            status: req.query.status || 'all',
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await require('../services/courseService').getMyCourses(userId, options);
        return ApiResponse.successResponse(res, 200, result, 'User courses retrieved successfully');
    });
}

module.exports = new UserController();