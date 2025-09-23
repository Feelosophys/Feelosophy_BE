// src/routes/forumRoutes.js
const express = require('express');
const {
    createForumPost,
    getForumPosts,
    getForumPostById,
    updateForumPost,
    deleteForumPost,
    addComment,
    addReaction
} = require('../controllers/forumController');
const {
    createForumPostValidationRules,
    updateForumPostValidationRules,
    getForumPostByIdValidationRules,
    deleteForumPostValidationRules,
    addCommentValidationRules,
    addReactionValidationRules,
    getForumPostsValidationRules
} = require('../validators/forumValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createForumPostValidationRules, validationResultHandler, createForumPost);
router.get('/', getForumPostsValidationRules, validationResultHandler, getForumPosts);
router.get('/:id', getForumPostByIdValidationRules, validationResultHandler, getForumPostById);
router.put('/:id', updateForumPostValidationRules, validationResultHandler, updateForumPost);
router.delete('/:id', deleteForumPostValidationRules, validationResultHandler, deleteForumPost);
router.post('/:id/comments', addCommentValidationRules, validationResultHandler, addComment);
router.post('/:id/reactions', addReactionValidationRules, validationResultHandler, addReaction);

module.exports = router;