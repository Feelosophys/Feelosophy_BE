// src/config/encoderConfig.js
const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
    hashPassword,
    comparePassword
};