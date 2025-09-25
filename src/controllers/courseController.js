// src/controllers/courseController.js
// Handles CRUD for courses
const courseService = require('../services/courseService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const { validationResult } = require('express-validator');

class CourseController {
    // GET /api/v1/courses/my-courses
    getMyCourses = catchAsync(async (req, res) => {
        // Validate request parameters
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const userId = req.user.id; // Extract from JWT token via authMiddleware
        const options = {
            page: req.query.page,
            limit: req.query.limit, 
            status: req.query.status,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await courseService.getMyCourses(userId, options);
        return ApiResponse.successResponse(res, 200, result, 'My courses retrieved successfully');
    });

    // GET /api/v1/courses/:courseId/progress  
    getCourseProgress = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const userId = req.user.id;
        const { courseId } = req.params;

        const progress = await courseService.getCourseProgress(userId, courseId);
        return ApiResponse.successResponse(res, 200, progress, 'Course progress retrieved successfully');
    });

    // GET /api/v1/courses/enrollment-stats
    getEnrollmentStats = catchAsync(async (req, res) => {
        const userId = req.user.id;
        
        const stats = await courseService.getEnrollmentStats(userId);
        return ApiResponse.successResponse(res, 200, stats, 'Enrollment statistics retrieved successfully');
    });

    // GET /api/v1/courses - Public endpoint
    getAllCourses = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const options = {
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            category: req.query.category,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
            featured: req.query.featured
        };

        const result = await courseService.getAllCourses(options);
        return ApiResponse.successResponse(res, 200, result, 'Courses retrieved successfully');
    });

    // GET /api/v1/courses/:courseId - Public endpoint
    getCourseDetails = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const { courseId } = req.params;
        const course = await courseService.getCourseById(courseId);
        
        return ApiResponse.successResponse(res, 200, course, 'Course details retrieved successfully');
    });

    // GET /api/v1/courses/categories - Public endpoint
    getAvailableCategories = catchAsync(async (req, res) => {
        const categories = await courseService.getAvailableCategories();
        return ApiResponse.successResponse(res, 200, { categories }, 'Available categories retrieved successfully');
    });

    // GET /api/v1/courses/stats - Public endpoint  
    getAllCoursesStats = catchAsync(async (req, res) => {
        const stats = await courseService.getCourseStats();
        return ApiResponse.successResponse(res, 200, stats, 'Course statistics retrieved successfully');
    });
}

module.exports = new CourseController();