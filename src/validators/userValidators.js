// src/validators/userValidators.js
const { body } = require('express-validator');

exports.updateProfileValidationRules = [
    body('name')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2-50 characters')
        .trim(),
    
    body('bio')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Bio cannot exceed 500 characters')
        .trim(),
    
    body('avatar')
        .optional()
        .isURL()
        .withMessage('Avatar must be a valid URL'),
    
    // Không cho phép edit email, password, roles vì security
    body('email').not().exists().withMessage('Email cannot be updated'),
    body('password').not().exists().withMessage('Password cannot be updated here'),
    body('roles').not().exists().withMessage('Roles cannot be updated'),
    body('googleId').not().exists().withMessage('GoogleId cannot be updated'),
];