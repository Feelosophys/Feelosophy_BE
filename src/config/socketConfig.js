// src/config/socketConfig.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

let io;

function initSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    // Middleware để authenticate socket connections
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token || socket.handshake.query.token;
            if (!token) {
                return next(new Error('Authentication error'));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (!user) {
                return next(new Error('User not found'));
            }

            socket.userId = user._id;
            socket.user = user;
            next();
        } catch (error) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log(`User ${socket.userId} connected`);

        // Join forum room
        socket.on('join-forum', (forumId) => {
            socket.join(`forum_${forumId}`);
            console.log(`User ${socket.userId} joined forum ${forumId}`);
        });

        // Leave forum room
        socket.on('leave-forum', (forumId) => {
            socket.leave(`forum_${forumId}`);
            console.log(`User ${socket.userId} left forum ${forumId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User ${socket.userId} disconnected`);
        });
    });

    return io;
}

function getIo() {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
}

module.exports = {
    initSocket,
    getIo
};