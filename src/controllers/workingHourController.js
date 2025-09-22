// src/controllers/workingHourController.js
const workingHourService = require('../services/workingHourService');
const {
    successResponse
} = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/v1/working-hours:
 *   post:
 *     summary: Create a new working hour (Teacher only)
 *     tags: [Working Hours]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *               startTime:
 *                 type: string
 *               endTime:
 *                 type: string
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: Working hour created
 */
exports.createWorkingHour = catchAsync(async (req, res) => {
    const teacherId = req.user.id;
    const workingHour = await workingHourService.createWorkingHour({
        teacherId,
        ...req.body
    });
    successResponse(res, 201, workingHour, 'Working hour created successfully');
});

/**
 * @swagger
 * /api/v1/working-hours:
 *   get:
 *     summary: Get working hours by teacher
 *     tags: [Working Hours]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of working hours
 */
exports.getWorkingHours = catchAsync(async (req, res) => {
    const teacherId = req.user.id;
    const workingHours = await workingHourService.getWorkingHoursByTeacher(teacherId);
    successResponse(res, 200, workingHours, 'Working hours retrieved successfully');
});