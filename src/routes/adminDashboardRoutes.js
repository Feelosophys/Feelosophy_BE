// src/routes/adminDashboardRoutes.js
const express = require('express');
const {
    getDashboardStats,
    getUserGrowth,
    getCourseStats,
    getUserTypeDistribution,
    getRecentActivities
} = require('../controllers/adminDashboardController.js');

const router = express.Router();

// Dashboard stats
router.get('/stats', getDashboardStats);//ok

// User growth data
router.get('/user-growth', getUserGrowth);//ok

// Course stats
router.get('/courses/stats', getCourseStats);// ok

// User type distribution
router.get('/users/distribution', getUserTypeDistribution);// ok

// Recent activities
router.get('/activities/recent', getRecentActivities);// ok

module.exports = router;