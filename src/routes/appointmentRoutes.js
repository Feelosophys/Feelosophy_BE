// src/routes/appointmentRoutes.js
const express = require('express');
const {
    bookAppointment,
    getUserAppointments
} = require('../controllers/appointmentController');
const {
    bookAppointmentValidationRules
} = require('../validators/appointmentValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Tất cả routes cần authentication
router.use(authMiddleware);

router.post('/', bookAppointmentValidationRules, validationResultHandler, bookAppointment);
router.get('/', getUserAppointments);

module.exports = router;