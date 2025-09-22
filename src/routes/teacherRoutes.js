// src/routes/teacherRoutes.js
const express = require('express');
const {
    getAllTeachers,
    getTeacherDetails
} = require('../controllers/teacherController');

const router = express.Router();

router.get('/', getAllTeachers);
router.get('/:teacherId', getTeacherDetails);

module.exports = router;