const {
    verifyToken
} = require('../config/jwtAuthConfig');
const AppError = require('../utils/customError');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    try {
        req.user = verifyToken(token);
        next();
    } catch (err) {
        next(new AppError('Invalid token', 401));
    }
};