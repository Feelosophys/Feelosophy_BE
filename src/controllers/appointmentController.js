// src/controllers/appointmentController.js
// Handles CRUD for appointments
const appointmentService = require('../services/appointmentService');
const {
    successResponse
} = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Book an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teacherId:
 *                 type: string
 *               workingHourId:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked
 */
exports.bookAppointment = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const appointment = await appointmentService.bookAppointment({
        userId,
        ...req.body
    });
    successResponse(res, 201, appointment, 'Appointment booked successfully');
});

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: Get user's appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's appointments
 */
exports.getUserAppointments = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const appointments = await appointmentService.getUserAppointments(userId);
    successResponse(res, 200, appointments, 'Appointments retrieved successfully');
});