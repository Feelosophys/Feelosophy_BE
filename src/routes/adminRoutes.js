// src/routes/adminUserRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const protect = require('../middlewares/authMiddleware');


// Admin User Management Routes
// Lấy danh sách người dùng với phân trang, lọc, sắp xếp
router.get('/users', protect, adminController.getAdminUsers); //ok

// Lấy thống kê người dùng
router.get('/users/stats', protect, adminController.getUserStats);//ok

// Xuất danh sách người dùng ra CSV
router.get('/users/export', protect, adminController.exportUsersToExcel);//ok

// Lấy chi tiết người dùng
router.get('/users/:userId', protect, adminController.getUserById);//ok

// Thêm người dùng mới
router.post('/users', protect, adminController.createUser);//ok

// Cập nhật thông tin người dùng
router.patch('/users/:userId', protect, adminController.updateUser);//ok

// Xóa người dùng
router.delete('/users/:userId', protect, adminController.deleteUser);//ok

// Phê duyệt người dùng
// router.patch('/users/:userId/approve', protect, adminController.approveUser);

// Kích hoạt/Vô hiệu hóa người dùng
// router.patch('/users/:userId/toggle-status', protect, adminController.toggleUserStatus);



// Admin Course Management Routes
// Lấy thống kê khóa học
router.get('/courses/stats', protect, adminController.getCourseStats);//da test ok

// Lấy chi tiết khóa học
router.get('/courses/:courseId', protect, adminController.getCourseById);//da test ok 

// Lấy danh sách khóa học với phân trang, lọc, sắp xếp
router.get('/courses', protect, adminController.getAllCourses);// da test ok

// Thêm khóa học mới
// chua ok can xu ly them file upload gom document va video
router.post('/courses', protect, adminController.createCourse);

// Cập nhật thông tin khóa học
// chua ok can xu ly them file upload gom document va video
router.patch('/courses/:courseId', protect, adminController.updateCourse);

// Xóa khóa học
//chua test
router.delete('/courses/:courseId', protect, adminController.deleteCourse);

module.exports = router;