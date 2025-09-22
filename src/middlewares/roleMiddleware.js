// src/middlewares/roleMiddleware.js
module.exports = (allowedRoles) => (req, res, next) => {
    if (!req.user || !req.user.roles || !allowedRoles.some(role => req.user.roles.includes(role))) {
        return res.status(403).json({
            message: 'Forbidden: Insufficient permissions'
        });
    }
    next();
};