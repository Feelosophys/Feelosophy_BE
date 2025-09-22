// src/validators/workingHourValidators.js
const {
    body
} = require('express-validator');

exports.createWorkingHourValidationRules = [
    body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO date'),
    body('startTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('Start time must be in HH:MM format'),
    body('endTime')
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .withMessage('End time must be in HH:MM format'),
    body('note')
    .optional()
    .isLength({
        max: 500
    })
    .withMessage('Note must be less than 500 characters')
];