// src/controllers/forumController.js
// Handles CRUD for forum posts
const forumService = require('../services/forumService');
const {
    successResponse
} = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * /api/v1/forum:
 *   post:
 *     summary: Create a new forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Forum post created
 */
exports.createForumPost = catchAsync(async (req, res) => {
    const userId = req.user.id;
    const forumPost = await forumService.createForumPost({
        ...req.body,
        authorId: userId
    });
    successResponse(res, 201, forumPost, 'Forum post created successfully');
});

/**
 * @swagger
 * /api/v1/forum:
 *   get:
 *     summary: Get forum posts
 *     tags: [Forum]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed]
 *       - in: query
 *         name: tags
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of forum posts
 */
exports.getForumPosts = catchAsync(async (req, res) => {
    const filters = {
        status: req.query.status,
        tags: req.query.tags ? req.query.tags.split(',') : [],
        limit: parseInt(req.query.limit) || 20,
        skip: parseInt(req.query.skip) || 0
    };
    const posts = await forumService.getForumPosts(filters);
    successResponse(res, 200, posts, 'Forum posts retrieved successfully');
});

/**
 * @swagger
 * /api/v1/forum/{id}:
 *   get:
 *     summary: Get forum post by ID
 *     tags: [Forum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Forum post details
 */
exports.getForumPostById = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const post = await forumService.getForumPostById(id);
    successResponse(res, 200, post, 'Forum post retrieved successfully');
});

/**
 * @swagger
 * /api/v1/forum/{id}:
 *   put:
 *     summary: Update forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [open, closed]
 *     responses:
 *       200:
 *         description: Forum post updated
 */
exports.updateForumPost = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;
    const updatedPost = await forumService.updateForumPost(id, userId, req.body);
    successResponse(res, 200, updatedPost, 'Forum post updated successfully');
});

/**
 * @swagger
 * /api/v1/forum/{id}:
 *   delete:
 *     summary: Delete forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Forum post deleted
 */
exports.deleteForumPost = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;
    const result = await forumService.deleteForumPost(id, userId);
    successResponse(res, 200, result, 'Forum post deleted successfully');
});

/**
 * @swagger
 * /api/v1/forum/{id}/comments:
 *   post:
 *     summary: Add comment to forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added
 */
exports.addComment = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;
    const {
        content
    } = req.body;
    const comment = await forumService.addComment(id, userId, content);
    successResponse(res, 201, comment, 'Comment added successfully');
});

/**
 * @swagger
 * /api/v1/forum/{id}/reactions:
 *   post:
 *     summary: Add or update reaction to forum post
 *     tags: [Forum]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [like, love, haha, wow, sad, angry]
 *     responses:
 *       200:
 *         description: Reaction added/updated
 */
exports.addReaction = catchAsync(async (req, res) => {
    const {
        id
    } = req.params;
    const userId = req.user.id;
    const {
        type
    } = req.body;
    const reaction = await forumService.addReaction(id, userId, type);
    successResponse(res, 200, reaction, 'Reaction added successfully');
});