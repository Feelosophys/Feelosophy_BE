// src/routes/authRoutes.js
const express = require('express');
const {
    register,
    login
} = require('../controllers/authController');
const {
    registerValidationRules,
    loginValidationRules
} = require('../validators/authValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');

const router = express.Router();

router.post('/register', registerValidationRules, validationResultHandler, register);
router.post('/login', loginValidationRules, validationResultHandler, login);

module.exports = router;