// src/models/Forum.js
const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['open', 'closed'],
        default: 'open'
    },
    views: {
        type: Number,
        default: 0
    },
    // Refs đến comments và reactions (dùng models chung)
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'
    }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Forum', forumSchema);