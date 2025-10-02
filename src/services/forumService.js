// src/services/forumService.js
// Handles business logic for forum posts
const Forum = require('../models/Forum');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');
const AppError = require('../utils/customError');
const {
    getIo
} = require('../config/socketConfig');
const {
    moderateContent
} = require('../utils/geminiUtils');

exports.createForumPost = async ({
    title,
    content,
    authorId,
    tags
}) => {
    // Moderate content using Gemini AI
    const moderation = await moderateContent(content);
    if (!moderation.isSafe) {
        throw new AppError(`Post content violates community guidelines: ${moderation.reason}`, 400);
    }

    const forumPost = await Forum.create({
        title,
        content,
        authorId,
        tags: tags || []
    });
    return forumPost;
};

exports.getForumPosts = async (filters = {}) => {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.tags && filters.tags.length > 0) query.tags = {
        $in: filters.tags
    };

    return await Forum.find(query)
        .populate('authorId', 'name email avatar')
        .populate({
            path: 'comments',
            populate: {
                path: 'userId',
                select: 'name email avatar'
            }
        })
        .populate({
            path: 'reactions',
            populate: {
                path: 'userId',
                select: 'name'
            }
        })
        .sort({
            createdAt: -1
        })
        .limit(filters.limit || 20)
        .skip(filters.skip || 0);
};

exports.getForumPostById = async (postId) => {
    const post = await Forum.findById(postId)
        .populate('authorId', 'name email avatar')
        .populate({
            path: 'comments',
            populate: {
                path: 'userId',
                select: 'name email avatar'
            }
        })
        .populate({
            path: 'reactions',
            populate: {
                path: 'userId',
                select: 'name email avatar'
            }
        });

    if (!post) throw new AppError('Forum post not found', 404);

    // Increment views
    post.views += 1;
    await post.save();

    return post;
};

exports.updateForumPost = async (postId, authorId, updates) => {
    const post = await Forum.findById(postId);
    if (!post) throw new AppError('Forum post not found', 404);
    if (post.authorId.toString() !== authorId) throw new AppError('Forbidden: Not the author', 403);

    Object.assign(post, updates);
    await post.save();
    return post;
};

exports.deleteForumPost = async (postId, authorId) => {
    const post = await Forum.findById(postId);
    if (!post) throw new AppError('Forum post not found', 404);
    if (post.authorId.toString() !== authorId) throw new AppError('Forbidden: Not the author', 403);

    await Forum.findByIdAndDelete(postId);
    return {
        message: 'Forum post deleted successfully'
    };
};

exports.addComment = async (postId, userId, content) => {
    const post = await Forum.findById(postId);
    if (!post) throw new AppError('Forum post not found', 404);

    // Moderate content using Gemini AI
    const moderation = await moderateContent(content);
    if (!moderation.isSafe) {
        throw new AppError(`Comment violates community guidelines: ${moderation.reason}`, 400);
    }

    const comment = await Comment.create({
        postId,
        postType: 'forum',
        userId,
        content
    });

    post.comments.push(comment._id);
    await post.save();

    const populatedComment = await comment.populate('userId', 'name email avatar');

    // Emit real-time event
    try {
        const io = getIo();
        io.to(`forum_${postId}`).emit('new-comment', {
            postId,
            comment: populatedComment
        });
    } catch (error) {
        console.error('Socket emit error:', error);
    }

    return populatedComment;
};
exports.addReaction = async (postId, userId, type) => {
    const post = await Forum.findById(postId);
    if (!post) throw new AppError('Forum post not found', 404);

    // Check if user already reacted
    const existingReaction = await Reaction.findOne({
        postId,
        postType: 'forum',
        userId
    });
    if (existingReaction) {
        if (existingReaction.type === type) {
            // Remove reaction if same type
            await Reaction.findByIdAndDelete(existingReaction._id);
            post.reactions.pull(existingReaction._id);
            await post.save();

            // Emit real-time event
            try {
                const io = getIo();
                io.to(`forum_${postId}`).emit('reaction-removed', {
                    postId,
                    userId,
                    type
                });
            } catch (error) {
                console.error('Socket emit error:', error);
            }

            return {
                message: 'Reaction removed'
            };
        } else {
            // Update reaction type
            existingReaction.type = type;
            await existingReaction.save();
            const populatedReaction = await existingReaction.populate('userId', 'name email avatar');

            // Emit real-time event
            try {
                const io = getIo();
                io.to(`forum_${postId}`).emit('reaction-updated', {
                    postId,
                    reaction: populatedReaction
                });
            } catch (error) {
                console.error('Socket emit error:', error);
            }

            return populatedReaction;
        }
    }

    // Add new reaction
    const reaction = await Reaction.create({
        postId,
        postType: 'forum',
        userId,
        type
    });

    post.reactions.push(reaction._id);
    await post.save();

    const populatedReaction = await reaction.populate('userId', 'name email avatar');

    // Emit real-time event
    try {
        const io = getIo();
        io.to(`forum_${postId}`).emit('new-reaction', {
            postId,
            reaction: populatedReaction
        });
    } catch (error) {
        console.error('Socket emit error:', error);
    }

    return populatedReaction;
};