// src/validators/courseValidators.js
const {
    query,
    param
} = require('express-validator');

exports.getMyCoursesValidationRules = [
    query('page')
    .optional()
    .isInt({
        min: 1
    })
    .withMessage('Page must be a positive integer'),

    query('limit')
    .optional()
    .isInt({
        min: 1,
        max: 50
    })
    .withMessage('Limit must be between 1-50'),

    query('status')
    .optional()
    .isIn(['enrolled', 'completed', 'all'])
    .withMessage('Status must be enrolled, completed, or all'),

    query('sortBy')
    .optional()
    .isIn(['enrolledAt', 'title', 'createdAt'])
    .withMessage('Sort by must be enrolledAt, title, or createdAt'),

    query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

exports.getCourseProgressValidationRules = [
    param('courseId')
    .trim()
    .customSanitizer(value => {
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }
        return value;
    })
    .isMongoId()
    .withMessage('Valid course ID is required. Must be a 24-character hexadecimal string')
];



// All course filter validation rules for a public endpoint
exports.getAllCoursesValidationRules = [
    query('page')
    .optional()
    .isInt({
        min: 1
    })
    .withMessage('Page must be a positive integer'),

    query('limit')
    .optional()
    .isInt({
        min: 1,
        max: 50
    })
    .withMessage('Limit must be between 1-50'),

    query('search')
    .optional()
    .isLength({
        min: 2,
        max: 100
    })
    .withMessage('Search term must be between 2-100 characters')
    .trim(),

    query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),

    query('minPrice')
    .optional()
    .isFloat({
        min: 0
    })
    .withMessage('Min price must be >= 0'),

    query('maxPrice')
    .optional()
    .isFloat({
        min: 0
    })
    .withMessage('Max price must be >= 0'),

    query('sortBy')
    .optional()
    .isIn(['title', 'price', 'createdAt', 'enrolledUsers'])
    .withMessage('Sort by must be title, price, createdAt, or enrolledUsers'),

    query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

    query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be boolean')
];

exports.getCourseByIdValidationRules = [
    param('courseId')
    .trim()
    .customSanitizer(value => {
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
            return value.slice(1, -1);
        }
        return value;
    })
    .isMongoId()
    .withMessage('Valid course ID is required. Must be a 24-character hexadecimal string')
];

exports.getCoursesByTypeValidationRules = [
    param('courseType')
    .isIn(['individual', 'group', 'corporate'])
    .withMessage('Course type must be individual, group, or corporate'),

    query('page')
    .optional()
    .isInt({
        min: 1
    })
    .withMessage('Page must be a positive integer'),

    query('limit')
    .optional()
    .isInt({
        min: 1,
        max: 50
    })
    .withMessage('Limit must be between 1-50'),

    query('ageRange')
    .optional()
    .isIn(['children', 'teenagers', 'adults'])
    .withMessage('Age range must be children, teenagers, or adults'),

    query('category')
    .optional()
    .isString()
    .withMessage('Category must be a string'),

    query('sortBy')
    .optional()
    .isIn(['rating', 'price', 'createdAt', 'students'])
    .withMessage('Sort by must be rating, price, createdAt, or students'),

    query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];