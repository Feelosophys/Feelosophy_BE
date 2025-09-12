// src/routes/blogRoutes.js
// Blog API routes
const express = require('express');
const blogController = require('../controllers/blogController');
const {
    getAllBlogsValidator,
    getBlogBySlugValidator,
    getBlogByIdValidator,
    createBlogValidator
} = require('../validators/blogValidators');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Blog:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Blog ID
 *         title:
 *           type: string
 *           description: Blog title
 *         slug:
 *           type: string
 *           description: Blog URL slug
 *         coverImage:
 *           type: string
 *           description: Cover image URL
 *         content:
 *           type: string
 *           description: Blog content
 *         authorId:
 *           type: object
 *           description: Author information
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Blog tags
 *         isPublished:
 *           type: boolean
 *           description: Publication status
 *         views:
 *           type: number
 *           description: View count
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/v1/blogs:
 *   get:
 *     summary: Get all blogs
 *     tags: [Blogs]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filter by tags (comma-separated)
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publication status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [title, createdAt, updatedAt, views]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     blogs:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Blog'
 *                     pagination:
 *                       type: object
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.get('/', getAllBlogsValidator, blogController.getAllBlogs);

/**
 * @swagger
 * /api/v1/blogs/slug/{slug}:
 *   get:
 *     summary: Get blog by slug
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog slug
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get('/slug/:slug', getBlogBySlugValidator, blogController.getBlogBySlug);

/**
 * @swagger
 * /api/v1/blogs/{id}:
 *   get:
 *     summary: Get blog by ID
 *     tags: [Blogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Blog ID
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getBlogByIdValidator, blogController.getBlogById);

/**
 * @swagger
 * /api/v1/blogs:
 *   post:
 *     summary: Create a new blog post
 *     tags: [Blogs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 200
 *                 description: Blog title
 *               content:
 *                 type: string
 *                 minLength: 50
 *                 description: Blog content
 *               coverImage:
 *                 type: string
 *                 format: url
 *                 description: Cover image URL
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 maxItems: 10
 *                 description: Blog tags
 *               isPublished:
 *                 type: boolean
 *                 description: Publication status
 *               authorId:
 *                 type: string
 *                 description: Author ID (if not using auth middleware)
 *     responses:
 *       201:
 *         description: Blog created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Blog'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Blog with this title already exists
 *       500:
 *         description: Server error
 */
router.post('/', createBlogValidator, blogController.createBlog);

module.exports = router;