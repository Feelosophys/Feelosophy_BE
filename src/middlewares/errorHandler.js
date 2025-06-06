// src/middlewares/errorHandler.js
const AppError = require('../utils/customError');

module.exports = (err, req, res, next) => {
    if (!(err instanceof AppError)) {
        console.error(err);
    }
    const status = err.statusCode || 500;
    res.status(status).json({
        status: 'error',
        message: err.message || 'Internal Server Error',
    });
};