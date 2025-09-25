// src/routes/courseRoutes.js
const express = require('express');
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const { 
    getMyCoursesValidationRules, 
    getCourseProgressValidationRules,
    getAllCoursesValidationRules,
    getCourseByIdValidationRules
} = require('../validators/courseValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MyCourse:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Enrollment ID
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *           description: Enrollment date
 *         status:
 *           type: string
 *           enum: [enrolled, completed]
 *           description: Course status
 *         viaOrganization:
 *           type: boolean
 *           description: Enrolled via organization
 *         course:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *             description:
 *               type: string
 *             price:
 *               type: number
 *             category:
 *               type: string
 *             instructorInfo:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 avatar:
 *                   type: string
 *         totalLessons:
 *           type: number
 *         progressPercentage:
 *           type: number
 *         enrollmentDuration:
 *           type: number
 *           description: Days since enrollment
 */

/**
 * @swagger
 * /api/v1/courses/my-courses:
 *   get:
 *     summary: Get all my enrolled courses
 *     tags: [My Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [enrolled, completed, all]
 *           default: all
 *         description: Filter courses by enrollment status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [enrolledAt, title, createdAt]
 *           default: enrolledAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: My courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MyCourse'
 *                     pagination:
 *                       type: object
 *                     summary:
 *                       type: object
 *       401:
 *         description: Unauthorized - JWT token required
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}/progress:
 *   get:
 *     summary: Get progress for a specific enrolled course
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
 *         description: Course progress retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course enrollment not found
 */

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all published courses (Public)
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 12
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price filter
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, price, createdAt, enrolledUsers]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     courses:
 *                       type: array
 *                     pagination:
 *                       type: object
 *                     filters:
 *                       type: object
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/v1/courses/{courseId}:
 *   get:
 *     summary: Get course details by ID (Public)
 *     tags: [Courses]
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
 *       404:
 *         description: Course not found
 *       403:
 *         description: Course not published
 */

/**
 * @swagger
 * /api/v1/courses/stats:
 *   get:
 *     summary: Get platform course statistics (Public)
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
 */

/**
 * @swagger
 * /api/v1/courses/categories:
 *   get:
 *     summary: Get available course categories (Public)
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Categories retrieved successfully
 */

/**
 * @swagger
 * /api/v1/courses/enrollment-stats:
 *   get:
 *     summary: Get enrollment statistics summary
 *     tags: [My Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics retrieved successfully
 */

// ========== PUBLIC ROUTES (No authentication required) ==========

// GET /api/v1/courses/stats - Must be first to avoid conflict with /:courseId
router.get('/stats', courseController.getAllCoursesStats);

// GET /api/v1/courses/categories
router.get('/categories', courseController.getAvailableCategories);

// GET /api/v1/courses
router.get('/', 
    getAllCoursesValidationRules,
    validationResultHandler,
    courseController.getAllCourses
);

// ========== PROTECTED ROUTES (Authentication required) ==========
// Mount protected routes BEFORE /:courseId to avoid conflicts
router.get('/enrollment-stats', authMiddleware, courseController.getEnrollmentStats);

router.get('/my-courses', 
    authMiddleware,
    getMyCoursesValidationRules,
    validationResultHandler,
    courseController.getMyCourses
);

router.get('/:courseId/progress', 
    authMiddleware,
    getCourseProgressValidationRules,
    validationResultHandler,
    courseController.getCourseProgress
);

// ========== PARAMETERIZED ROUTES (Must be last) ==========

// GET /api/v1/courses/:courseId - Must be AFTER all specific routes
router.get('/:courseId',
    getCourseByIdValidationRules, 
    validationResultHandler,
    courseController.getCourseDetails
);

module.exports = router;