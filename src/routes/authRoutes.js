// src/routes/authRoutes.js
const express = require('express');
const passport = require('../config/passportConfig');
const {
    register,
    login,
    refreshToken,
    changePassword,
    googleAuthCallback
} = require('../controllers/authController');
const {
    registerValidationRules,
    loginValidationRules,
    refreshTokenValidationRules,
    changePasswordValidationRules
} = require('../validators/authValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/register', registerValidationRules, validationResultHandler, register);
router.post('/login', loginValidationRules, validationResultHandler, login);
router.post('/refresh-token', refreshTokenValidationRules, validationResultHandler, refreshToken);
router.post('/change-password', authMiddleware, changePasswordValidationRules, validationResultHandler, changePassword);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), googleAuthCallback);

module.exports = router;