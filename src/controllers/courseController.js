// src/controllers/courseController.js
// Handles CRUD for courses
const courseService = require('../services/courseService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const {
    validationResult
} = require('express-validator');

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
        const {
            courseId
        } = req.params;

        const progress = await courseService.getCourseProgress(userId, courseId);
        return ApiResponse.successResponse(res, 200, progress, 'Course progress retrieved successfully');
    });

    /**
     * @swagger
     * /api/v1/courses/{courseId}/learn:
     *   get:
     *     summary: Get learning content for a purchased course
     *     tags: [My Courses]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: courseId
     *         required: true
     *         schema:
     *           type: string
     *         description: Course ID
     *     responses:
     *       200:
     *         description: Course learning content retrieved successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: User is not enrolled in this course
     *       404:
     *         description: Course not found
     */
    getCourseLearningContent = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const userId = req.user.id;
        const {
            courseId
        } = req.params;

        const learningContent = await courseService.getCourseLearningContent(userId, courseId);
        return ApiResponse.successResponse(res, 200, learningContent, 'Course learning content retrieved successfully');
    });

    /**
     * @swagger
     * /api/v1/courses/{courseId}/my-details:
     *   get:
     *     summary: Get full course details for a purchased course
     *     tags: [My Courses]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: courseId
     *         required: true
     *         schema:
     *           type: string
     *         description: Course ID
     *     responses:
     *       200:
     *         description: Course details retrieved successfully
     *       401:
     *         description: Unauthorized
     *       403:
     *         description: User is not enrolled in this course
     *       404:
     *         description: Course not found
     */
    getPurchasedCourseDetails = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const userId = req.user.id;
        const {
            courseId
        } = req.params;

        const courseDetails = await courseService.getPurchasedCourseDetails(userId, courseId);
        return ApiResponse.successResponse(res, 200, courseDetails, 'Purchased course details retrieved successfully');
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

        const {
            courseId
        } = req.params;
        const course = await courseService.getCourseById(courseId);

        return ApiResponse.successResponse(res, 200, course, 'Course details retrieved successfully');
    });

    // GET /api/v1/courses/categories - Public endpoint
    getAvailableCategories = catchAsync(async (req, res) => {
        const categories = await courseService.getAvailableCategories();
        return ApiResponse.successResponse(res, 200, {
            categories
        }, 'Available categories retrieved successfully');
    });

    // GET /api/v1/courses/stats - Public endpoint  
    getAllCoursesStats = catchAsync(async (req, res) => {
        const stats = await courseService.getCourseStats();
        return ApiResponse.successResponse(res, 200, stats, 'Course statistics retrieved successfully');
    });

    // GET /api/v1/courses/type/:courseType - Public endpoint
    getCoursesByType = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const {
            courseType
        } = req.params;
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            ageRange: req.query.ageRange,
            category: req.query.category,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await courseService.getCoursesByType(courseType, options);
        return ApiResponse.successResponse(res, 200, result, `Courses by type '${courseType}' retrieved successfully`);
    });

    // GET /api/v1/courses/top-rated - Public endpoint
    getTopRatedCourses = catchAsync(async (req, res) => {
        const limit = req.query.limit || 10;
        const courses = await courseService.getTopRatedCourses(limit);
        return ApiResponse.successResponse(res, 200, {
            courses
        }, 'Top rated courses retrieved successfully');
    });

    // GET /api/v1/users/:userId/courses - Public endpoint for user profile
    getUserCourses = catchAsync(async (req, res) => {
        const {
            userId
        } = req.params;
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            status: 'completed' // Only show completed courses for public profile
        };

        const result = await courseService.getMyCourses(userId, options);
        return ApiResponse.successResponse(res, 200, result, 'User courses retrieved successfully');
    });

    // POST /api/v1/courses - Teacher only endpoint
    /**
     * @swagger
     * /api/v1/courses:
     *   post:
     *     summary: Create a new course
     *     tags: [Courses]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - title
     *               - description
     *               - price
     *               - category
     *             properties:
     *               title:
     *                 type: string
     *                 example: "Kỹ năng quản lý cảm xúc"
     *               description:
     *                 type: string
     *                 example: "Khóa học giúp bạn kiểm soát và điều hướng cảm xúc trong cuộc sống"
     *               price:
     *                 type: number
     *                 example: 1299000
     *               originalPrice:
     *                 type: number
     *               category:
     *                 type: string
     *                 example: "Tâm lý"
     *               ageRange:
     *                 type: string
     *                 example: "18-35"
     *               courseType:
     *                 type: string
     *                 enum: [individual, corporate, group]
     *                 default: individual
     *               totalHours:
     *                 type: number
     *                 example: 12
     *               courseImg:
     *                 type: string
     *                 format: uri
     *               features:
     *                 type: array
     *                 items:
     *                   type: string
     *               isPublished:
     *                 type: boolean
     *               lessons:
     *                 type: array
     *                 description: "Optional list of lessons to create along with the course"
     *                 items:
     *                   type: object
     *                   required:
     *                     - title
     *                   properties:
     *                     title:
     *                       type: string
     *                       example: "Giới thiệu về cảm xúc"
     *                     videos:
     *                       type: array
     *                       items:
     *                         type: object
     *                         required:
     *                           - title
     *                           - url
     *                         properties:
     *                           title:
     *                             type: string
     *                           url:
     *                             type: string
     *                             format: uri
     *                           duration:
     *                             type: number
     *                             description: "Duration in seconds"
     *                     documents:
     *                       type: array
     *                       items:
     *                         type: object
     *                         required:
     *                           - name
     *                           - fileUrl
     *                         properties:
     *                           name:
     *                             type: string
     *                           fileUrl:
     *                             type: string
     *                             format: uri
     *     responses:
     *       201:
     *         description: Course created successfully
     *       400:
     *         description: Validation failed or missing required data
     *       401:
     *         description: Unauthorized
     */
    createCourse = catchAsync(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const courseData = {
            ...req.body,
            instructor: req.user.id // Set instructor to current authenticated user
        };

        const newCourse = await courseService.createCourse(courseData);
        return ApiResponse.successResponse(res, 201, newCourse, 'Course created successfully');
    });
}

module.exports = new CourseController();