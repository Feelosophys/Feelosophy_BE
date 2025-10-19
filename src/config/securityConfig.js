// src/config/securityConfig.js
const cors = require('cors');
const helmet = require('helmet');

// Allow multiple frontend domains
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.FRONTEND_URL,
    'https://fe-three-topaz.vercel.app', // Vercel default URL
    'https://feelosophy.io.vn', // Custom domain
    'https://www.feelosophy.io.vn', // www subdomain
].filter(Boolean);

const corsMiddleware = cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // In production, check allowed origins
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('❌ CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
});

const helmetMiddleware = helmet();

module.exports = {
    corsMiddleware,
    helmetMiddleware
};