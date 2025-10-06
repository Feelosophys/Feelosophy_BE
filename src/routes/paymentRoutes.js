// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const protect = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/v1/payments/course/{courseId}:
 *   post:
 *     summary: Tạo yêu cầu thanh toán cho khóa học
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của khóa học
 *     responses:
 *       200:
 *         description: Tạo yêu cầu thanh toán thành công
 *       404:
 *         description: Không tìm thấy khóa học
 *       500:
 *         description: Lỗi server
 */
router.post('/course/:courseId', protect, paymentController.createPayment);

/**
 * @swagger
 * /api/v1/payments/check/{orderId}:
 *   get:
 *     summary: Kiểm tra trạng thái thanh toán
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mã đơn hàng
 *     responses:
 *       200:
 *         description: Kiểm tra trạng thái thành công
 *       500:
 *         description: Lỗi server
 */
router.get('/check/:orderId', paymentController.checkPaymentStatus);

module.exports = router;
