// src/controllers/adminController.js
const adminService = require('../services/adminDashboardService.js');
const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/v1/admin-dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [7days, 30days, 3months, 12months]
 *           default: 12months
 *         description: Time range for statistics
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 totalExperts:
 *                   type: number
 *                 totalCourses:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *                 monthlyRevenue:
 *                   type: number
 *                 growthRate:
 *                   type: number
 *                 activeUsers:
 *                   type: number
 *                 coursesCompleted:
 *                   type: number
 *                 averageRating:
 *                   type: number
 *                 responseTime:
 *                   type: string
 */
exports.getDashboardStats = catchAsync(async (req, res) => {
    const { timeRange = '12months' } = req.query;
    const stats = await adminService.getDashboardStats(timeRange);
    successResponse(res, 200, stats, 'Dashboard stats retrieved successfully');
});

/**
 * @swagger
 * /api/v1/admin-dashboard/user-growth:
 *   get:
 *     summary: Get user growth data
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [7days, 30days, 3months, 12months]
 *           default: 12months
 *         description: Time range for user growth data
 *     responses:
 *       200:
 *         description: User growth data by month
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   month:
 *                     type: string
 *                   users:
 *                     type: number
 *                   experts:
 *                     type: number
 *                   revenue:
 *                     type: number
 */
exports.getUserGrowth = catchAsync(async (req, res) => {
    const { timeRange = '12months' } = req.query;
    const data = await adminService.getUserGrowth(timeRange);
    successResponse(res, 200, data, 'User growth data retrieved successfully');
});

/**
 * @swagger
 * /api/v1/admin-dashboard/courses/stats:
 *   get:
 *     summary: Get course statistics
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [7days, 30days, 3months, 12months]
 *           default: 12months
 *         description: Time range for course stats
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 6
 *         description: Number of courses to return
 *     responses:
 *       200:
 *         description: Course statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   category:
 *                     type: string
 *                   students:
 *                     type: number
 *                   revenue:
 *                     type: number
 */
exports.getCourseStats = catchAsync(async (req, res) => {
    const { timeRange = '12months', limit = 6 } = req.query;
    const data = await adminService.getCourseStats(timeRange, parseInt(limit));
    successResponse(res, 200, data, 'Course stats retrieved successfully');
});

/**
 * @swagger
 * /api/v1/admin-dashboard/users/distribution:
 *   get:
 *     summary: Get user type distribution
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: timeRange
 *         schema:
 *           type: string
 *           enum: [7days, 30days, 3months, 12months]
 *           default: 12months
 *         description: Time range for user distribution
 *     responses:
 *       200:
 *         description: User type distribution
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   value:
 *                     type: number
 *                   percentage:
 *                     type: number
 *                   color:
 *                     type: string
 */
exports.getUserTypeDistribution = catchAsync(async (req, res) => {
    const { timeRange = '12months' } = req.query;
    const data = await adminService.getUserTypeDistribution(timeRange);
    successResponse(res, 200, data, 'User type distribution retrieved successfully');
});

/**
 * @swagger
 * /api/v1/admin-dashboard/activities/recent:
 *   get:
 *     summary: Get recent activities
 *     tags: [Admin Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 5
 *         description: Number of activities to return
 *       - in: query
 *         stateless:
 *           type: string
 *           default: all
 *         description: Filter by activity type
 *     responses:
 *       200:
 *         description: Recent activities
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   type:
 *                     type: string
 *                   user:
 *                     type: string
 *                   time:
 *                     type: string
 *                   description:
 *                     type: string
 */
exports.getRecentActivities = catchAsync(async (req, res) => {
    const { limit = 5, type = 'all' } = req.query;
    const data = await adminService.getRecentActivities(parseInt(limit), type);
    successResponse(res, 200, data, 'Recent activities retrieved successfully');
});