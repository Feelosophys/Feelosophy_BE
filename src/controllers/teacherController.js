// src/controllers/teacherController.js
const teacherService = require('../services/teacherService');
const {
    successResponse
} = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/v1/teachers:
 *   get:
 *     summary: Get all teachers
 *     tags: [Teachers]
 *     responses:
 *       200:
 *         description: List of teachers
 */
exports.getAllTeachers = catchAsync(async (req, res) => {
    const teachers = await teacherService.getAllTeachers();
    successResponse(res, 200, teachers, 'Teachers retrieved successfully');
});

/**
 * @swagger
 * /api/v1/teachers/{teacherId}:
 *   get:
 *     summary: Get teacher details with working hours
 *     tags: [Teachers]
 *     parameters:
 *       - in: path
 *         name: teacherId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Teacher details with working hours
 */
exports.getTeacherDetails = catchAsync(async (req, res) => {
    const {
        teacherId
    } = req.params;
    const data = await teacherService.getTeacherDetails(teacherId);
    successResponse(res, 200, data, 'Teacher details retrieved successfully');
});