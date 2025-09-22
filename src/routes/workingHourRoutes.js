// src/routes/workingHourRoutes.js
const express = require('express');
const {
    createWorkingHour,
    getWorkingHours
} = require('../controllers/workingHourController');
const {
    createWorkingHourValidationRules
} = require('../validators/workingHourValidators');
const validationResultHandler = require('../middlewares/validationResultHandler');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Tất cả routes đều yêu cầu authentication và role 'teacher'
router.use(authMiddleware);
router.use(roleMiddleware(['teacher']));

router.post('/', createWorkingHourValidationRules, validationResultHandler, createWorkingHour);
router.get('/', getWorkingHours);

module.exports = router;