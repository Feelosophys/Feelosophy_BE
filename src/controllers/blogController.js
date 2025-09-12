// src/controllers/blogController.js
// Handles HTTP requests for blog operations
const blogService = require('../services/blogService');
const catchAsync = require('../utils/catchAsync');
const ApiResponse = require('../utils/apiResponse');
const {
    validationResult
} = require('express-validator');

class BlogController {
    // GET /api/v1/blogs
    getAllBlogs = catchAsync(async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed');
        }

        const options = {
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            tags: req.query.tags,
            isPublished: req.query.isPublished,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder
        };

        const result = await blogService.getAllBlogs(options);

        return ApiResponse.successResponse(res, 200, result, 'Blogs retrieved successfully');
    });

    // GET /api/v1/blogs/slug/:slug
    getBlogBySlug = catchAsync(async (req, res) => {
        const {
            slug
        } = req.params;
        const blog = await blogService.getBlogBySlug(slug);

        return ApiResponse.successResponse(res, 200, blog, 'Blog retrieved successfully');
    });

    // GET /api/v1/blogs/:id
    getBlogById = catchAsync(async (req, res) => {
        const {
            id
        } = req.params;
        const blog = await blogService.getBlogById(id);

        return ApiResponse.successResponse(res, 200, blog, 'Blog retrieved successfully');
    });

    // POST /api/v1/blogs
    createBlog = catchAsync(async (req, res) => {
        // Handle validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse.errorResponse(res, 400, 'Validation failed', errors.array());
        }

        const blogData = req.body;
        const authorId = req.user?.id || req.body.authorId; // Get from auth middleware or body

        if (!authorId) {
            return ApiResponse.errorResponse(res, 400, 'Author ID is required');
        }

        const blog = await blogService.createBlog(blogData, authorId);

        return ApiResponse.successResponse(res, 201, blog, 'Blog created successfully');
    });
}

module.exports = new BlogController();