// src/validators/blogValidators.js
// Validation rules for blog API endpoints
const {
    query,
    param,
    body
} = require('express-validator');

const getAllBlogsValidator = [
    query('page')
    .optional()
    .isInt({
        min: 1
    })
    .withMessage('Page must be a positive integer')
    .toInt(),

    query('limit')
    .optional()
    .isInt({
        min: 1,
        max: 100
    })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),

    query('search')
    .optional()
    .isString()
    .trim()
    .isLength({
        min: 1,
        max: 100
    })
    .withMessage('Search must be between 1 and 100 characters'),

    query('tags')
    .optional()
    .isString()
    .trim()
    .withMessage('Tags must be a string'),

    query('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean(),

    query('sortBy')
    .optional()
    .isIn(['title', 'createdAt', 'updatedAt', 'views'])
    .withMessage('sortBy must be one of: title, createdAt, updatedAt, views'),

    query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be either asc or desc')
];

const getBlogBySlugValidator = [
    param('slug')
    .notEmpty()
    .withMessage('Slug is required')
    .isString()
    .withMessage('Slug must be a string')
    .matches(/^[a-z0-9-]+$/)
    .withMessage('Slug must contain only lowercase letters, numbers, and hyphens')
];

const getBlogByIdValidator = [
    param('id')
    .notEmpty()
    .withMessage('Blog ID is required')
    .isMongoId()
    .withMessage('Invalid blog ID format')
];

const createBlogValidator = [
    body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .isLength({
        min: 5,
        max: 200
    })
    .withMessage('Title must be between 5 and 200 characters'),

    body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isString()
    .withMessage('Content must be a string')
    .isLength({
        min: 50
    })
    .withMessage('Content must be at least 50 characters'),

    body('coverImage')
    .optional()
    .isURL()
    .withMessage('Cover image must be a valid URL'),

    body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
        if (tags && tags.length > 10) {
            throw new Error('Maximum 10 tags allowed');
        }
        return true;
    }),

    body('tags.*')
    .optional()
    .isString()
    .withMessage('Each tag must be a string')
    .isLength({
        min: 1,
        max: 30
    })
    .withMessage('Each tag must be between 1 and 30 characters'),

    body('isPublished')
    .optional()
    .isBoolean()
    .withMessage('isPublished must be a boolean')
    .toBoolean(),

    body('authorId')
    .optional()
    .isMongoId()
    .withMessage('Author ID must be a valid MongoDB ID')
];

module.exports = {
    getAllBlogsValidator,
    getBlogBySlugValidator,
    getBlogByIdValidator,
    createBlogValidator
};