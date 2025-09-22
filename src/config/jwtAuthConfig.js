const jwt = require('jsonwebtoken');

function generateToken(payload) {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });
}

function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

function generateRefreshToken(userId) {
    return jwt.sign({
            id: userId
        },
        process.env.JWT_SECRET, {
            expiresIn: '7d'
        }
    );
}

module.exports = {
    generateToken,
    verifyToken,
    secret: process.env.JWT_SECRET,
    generateRefreshToken
};