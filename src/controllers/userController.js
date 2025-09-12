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
}

module.exports = new UserController();