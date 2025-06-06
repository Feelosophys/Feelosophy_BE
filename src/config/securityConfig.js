// src/config/securityConfig.js
const cors = require('cors');
const helmet = require('helmet');

const corsMiddleware = cors({
    origin: '*', // Adjust for production
});

const helmetMiddleware = helmet();

module.exports = {
    corsMiddleware,
    helmetMiddleware
};