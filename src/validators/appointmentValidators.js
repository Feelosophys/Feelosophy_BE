// src/validators/appointmentValidators.js
const {
    body
} = require('express-validator');

exports.bookAppointmentValidationRules = [
    body('teacherId')
    .isMongoId()
    .withMessage('Teacher ID must be a valid MongoDB ObjectId'),
    body('workingHourId')
    .isMongoId()
    .withMessage('Working hour ID must be a valid MongoDB ObjectId'),
    body('notes')
    .optional()
    .isLength({
        max: 500
    })
    .withMessage('Notes must be less than 500 characters')
];