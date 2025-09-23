// src/routes/appointmentRoutes.js
const express = require('express');
const {
    bookAppointment,
    getUserAppointments,
    getTeacherAppointments,
    joinAppointment
} = require('../controllers/appointmentController');
const {
    bookAppointmentValidationRules
} = require('../validators/appointmentValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Tất cả routes cần authentication
router.use(authMiddleware);

router.post('/', bookAppointmentValidationRules, validationResultHandler, bookAppointment);
router.get('/', getUserAppointments);
router.get('/teacher', roleMiddleware(['teacher', 'instructor']), getTeacherAppointments);
router.get('/:id/join', joinAppointment);

module.exports = router;