// src/middlewares/validationResultHandler.js
const {
    validationResult
} = require('express-validator');
const AppError = require('../utils/customError');

module.exports = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new AppError(errors.array().map(e => e.msg).join(', '), 400));
    }
    next();
};