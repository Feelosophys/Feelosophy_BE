// src/validators/authValidators.js
const {
    body
} = require('express-validator');

exports.registerValidationRules = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({
        min: 6
    }).withMessage('Password min 6 chars'),
];

exports.loginValidationRules = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
];

exports.refreshTokenValidationRules = [
    body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

exports.changePasswordValidationRules = [
    body('oldPassword').notEmpty().withMessage('Old password is required'),
    body('newPassword').isLength({
        min: 6
    }).withMessage('New password min 6 chars'),
];