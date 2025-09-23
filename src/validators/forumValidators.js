// src/validators/forumValidators.js
const {
    body,
    param,
    query
} = require('express-validator');

exports.createForumPostValidationRules = [
    body('title')
    .trim()
    .isLength({
        min: 5,
        max: 200
    })
    .withMessage('Title must be between 5 and 200 characters'),
    body('content')
    .trim()
    .isLength({
        min: 10
    })
    .withMessage('Content must be at least 10 characters'),
    body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({
        min: 1,
        max: 50
    })
    .withMessage('Each tag must be between 1 and 50 characters')
];

exports.updateForumPostValidationRules = [
    param('id')
    .isMongoId()
    .withMessage('Invalid forum post ID'),
    body('title')
    .optional()
    .trim()
    .isLength({
        min: 5,
        max: 200
    })
    .withMessage('Title must be between 5 and 200 characters'),
    body('content')
    .optional()
    .trim()
    .isLength({
        min: 10
    })
    .withMessage('Content must be at least 10 characters'),
    body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
    body('tags.*')
    .optional()
    .isString()
    .trim()
    .isLength({
        min: 1,
        max: 50
    })
    .withMessage('Each tag must be between 1 and 50 characters'),
    body('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed')
];

exports.getForumPostByIdValidationRules = [
    param('id')
    .isMongoId()
    .withMessage('Invalid forum post ID')
];

exports.deleteForumPostValidationRules = [
    param('id')
    .isMongoId()
    .withMessage('Invalid forum post ID')
];

exports.addCommentValidationRules = [
    param('id')
    .isMongoId()
    .withMessage('Invalid forum post ID'),
    body('content')
    .trim()
    .isLength({
        min: 1,
        max: 1000
    })
    .withMessage('Comment must be between 1 and 1000 characters')
];

exports.addReactionValidationRules = [
    param('id')
    .isMongoId()
    .withMessage('Invalid forum post ID'),
    body('type')
    .isIn(['like', 'love', 'haha', 'wow', 'sad', 'angry'])
    .withMessage('Invalid reaction type')
];

exports.getForumPostsValidationRules = [
    query('status')
    .optional()
    .isIn(['open', 'closed'])
    .withMessage('Status must be open or closed'),
    query('tags')
    .optional()
    .isString()
    .withMessage('Tags must be a comma-separated string'),
    query('limit')
    .optional()
    .isInt({
        min: 1,
        max: 100
    })
    .withMessage('Limit must be between 1 and 100'),
    query('skip')
    .optional()
    .isInt({
        min: 0
    })
    .withMessage('Skip must be a non-negative integer')
];