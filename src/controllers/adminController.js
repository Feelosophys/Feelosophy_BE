// src/controllers/adminController.js
const adminService = require('../services/adminService');
const { successResponse } = require('../utils/apiResponse');
const catchAsync = require('../utils/catchAsync');

/**
 * @swagger
 * tags:
 *   - name: Admin Users
 *     description: APIs for managing users (Patients, Experts, Admins) for administrators
 *   - name: Admin Courses
 *     description: APIs for managing courses for administrators
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Retrieve a list of users with pagination, filtering, searching, and sorting
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, email, or phone number
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [all, patient, expert, admin]
 *           default: all
 *         description: Filter by user role
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, inactive, pending]
 *           default: all
 *         description: Filter by user status
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: joinDate
 *         description: Field to sort by (e.g., name, joinDate, lastLogin)
 *       - in: query
 *         name: sort_direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       role:
 *                         type: string
 *                       status:
 *                         type: string
 *                       avatar:
 *                         type: string
 *                       joinDate:
 *                         type: string
 *                       lastLogin:
 *                         type: string
 *                       coursesEnrolled:
 *                         type: number
 *                       totalSpent:
 *                         type: number
 *                       city:
 *                         type: string
 *                       specialization:
 *                         type: string
 *                       rating:
 *                         type: number
 *                       consultations:
 *                         type: number
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                 totalUsers:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.getAdminUsers = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    role,
    status,
    sort_by,
    sort_direction,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    role,
    status,
    sortBy: sort_by,
    sortDirection: sort_direction,
  };

  const result = await adminService.getPaginatedUsers(options);

  successResponse(res, 200, result, 'Danh sách người dùng được lấy thành công');
});

/**
 * @swagger
 * /api/v1/admin/users/stats:
 *   get:
 *     summary: Retrieve user statistics overview
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: integer
 *                 activeUsers:
 *                   type: integer
 *                 experts:
 *                   type: integer
 *                 patients:
 *                   type: integer
 *                 admins:
 *                   type: integer
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.getUserStats = catchAsync(async (req, res) => {
  const stats = await adminService.getUserStatistics();

  successResponse(res, 200, stats, 'Thống kê người dùng được lấy thành công');
});

/**
 * @swagger
 * /api/v1/admin/users/export:
 *   get:
 *     summary: Export list of users to Excel
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users exported to Excel successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.exportUsersToExcel = catchAsync(async (req, res) => {
  const excelBuffer = await adminService.exportUsersToExcel();

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="users_export_${new Date().toISOString().split('T')[0]}.xlsx"`);

  res.send(excelBuffer);
});

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   get:
 *     summary: Retrieve details of a specific user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 joinDate:
 *                   type: string
 *                 lastLogin:
 *                   type: string
 *                 coursesEnrolled:
 *                   type: number
 *                 totalSpent:
 *                   type: number
 *                 city:
 *                   type: string
 *                 specialization:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 consultations:
 *                   type: number
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.getUserById = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const user = await adminService.getUserById(userId);

  successResponse(res, 200, user, 'Chi tiết người dùng được lấy thành công');
});

/**
 * @swagger
 * /api/v1/admin/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [patient, expert, admin]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *               avatar:
 *                 type: string
 *               city:
 *                 type: string
 *               specialization:
 *                 type: string
 *               rating:
 *                 type: number
 *               consultations:
 *                 type: number
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 joinDate:
 *                   type: string
 *                 lastLogin:
 *                   type: string
 *                 coursesEnrolled:
 *                   type: number
 *                 totalSpent:
 *                   type: number
 *                 city:
 *                   type: string
 *                 specialization:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 consultations:
 *                   type: number
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.createUser = catchAsync(async (req, res) => {
  const userData = req.body;

  const newUser = await adminService.createUser(userData);

  successResponse(res, 201, newUser, 'Người dùng được tạo thành công');
});

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   patch:
 *     summary: Update user information or manage user status
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending]
 *               avatar:
 *                 type: string
 *               city:
 *                 type: string
 *               specialization:
 *                 type: string
 *               rating:
 *                 type: number
 *               consultations:
 *                 type: number
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 joinDate:
 *                   type: string
 *                 lastLogin:
 *                   type: string
 *                 coursesEnrolled:
 *                   type: number
 *                 totalSpent:
 *                   type: number
 *                 city:
 *                   type: string
 *                 specialization:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 consultations:
 *                   type: number
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.updateUser = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const updateData = req.body;

  const updatedUser = await adminService.updateUser(userId, updateData);

  successResponse(res, 200, updatedUser, 'Người dùng được cập nhật thành công');
});

/**
 * @swagger
 * /api/v1/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user from the system
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.deleteUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  await adminService.deleteUser(userId);

  successResponse(res, 204, null, 'Người dùng được xóa thành công');
});

/**
 * @swagger
 * /api/v1/admin/users/{userId}/approve:
 *   patch:
 *     summary: Approve a pending user
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to approve
 *     responses:
 *       200:
 *         description: User approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 joinDate:
 *                   type: string
 *                 lastLogin:
 *                   type: string
 *                 coursesEnrolled:
 *                   type: number
 *                 totalSpent:
 *                   type: number
 *                 city:
 *                   type: string
 *                 specialization:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 consultations:
 *                   type: number
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 *       400:
 *         description: User is not in pending status
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.approveUser = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const updatedUser = await adminService.approveUser(userId);

  successResponse(res, 200, updatedUser, 'Người dùng được phê duyệt thành công');
});

/**
 * @swagger
 * /api/v1/admin/users/{userId}/toggle-status:
 *   patch:
 *     summary: Toggle user status between active and inactive
 *     tags: [Admin Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: User status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 phone:
 *                   type: string
 *                 role:
 *                   type: string
 *                 status:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 joinDate:
 *                   type: string
 *                 lastLogin:
 *                   type: string
 *                 coursesEnrolled:
 *                   type: number
 *                 totalSpent:
 *                   type: number
 *                 city:
 *                   type: string
 *                 specialization:
 *                   type: string
 *                 rating:
 *                   type: number
 *                 consultations:
 *                   type: number
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: User not found
 *       400:
 *         description: Cannot toggle status for pending user
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.toggleUserStatus = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const updatedUser = await adminService.toggleUserStatus(userId);

  successResponse(res, 200, updatedUser, 'Trạng thái người dùng được thay đổi thành công');
});

/**
 * @swagger
 * /api/v1/admin/courses:
 *   get:
 *     summary: Retrieve a list of courses with pagination, filtering, searching, and sorting
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by course title or instructor
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [all, individual, corporate]
 *           default: all
 *         description: Filter by course category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [all, active, draft, archived]
 *           default: all
 *         description: Filter by course status
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [all, Beginner, Intermediate, Advanced]
 *           default: all
 *         description: Filter by course level
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           default: createdDate
 *         description: Field to sort by (e.g., title, students, revenue, createdDate)
 *       - in: query
 *         name: sort_direction
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: List of courses retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       instructor:
 *                         type: string
 *                       category:
 *                         type: string
 *                       level:
 *                         type: string
 *                       price:
 *                         type: number
 *                       originalPrice:
 *                         type: number
 *                       students:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       revenue:
 *                         type: number
 *                       completionRate:
 *                         type: number
 *                       status:
 *                         type: string
 *                       createdDate:
 *                         type: string
 *                       lastUpdated:
 *                         type: string
 *                       duration:
 *                         type: string
 *                       image:
 *                         type: string
 *                 totalCourses:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.getAllCourses = catchAsync(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    search,
    category,
    status,
    level,
    sort_by,
    sort_direction,
  } = req.query;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    search,
    category,
    status,
    level,
    sortBy: sort_by,
    sortDirection: sort_direction,
  };

  const result = await adminService.getPaginatedCourses(options);

  successResponse(res, 200, result, 'Danh sách khóa học được lấy thành công');
});

/**
 * @swagger
 * /api/v1/admin/courses/stats:
 *   get:
 *     summary: Retrieve course statistics overview
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Course statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalCourses:
 *                   type: integer
 *                 activeCourses:
 *                   type: integer
 *                 totalStudents:
 *                   type: integer
 *                 totalRevenue:
 *                   type: number
 *                 averageRating:
 *                   type: number
 *                 averageCompletionRate:
 *                   type: number
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.getCourseStats = catchAsync(async (req, res) => {
  const stats = await adminService.getCourseStatistics();

  successResponse(res, 200, stats, 'Thống kê khóa học được lấy thành công');
});

/**
 * @swagger
 * /api/v1/admin/courses/export:
 *   get:
 *     summary: Export list of courses to CSV
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Courses exported to CSV successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
// exports.exportCoursesToCSV = catchAsync(async (req, res) => {
//   const csvBuffer = await adminService.exportCoursesToCSV();

//   res.setHeader('Content-Type', 'text/csv; charset=utf-8');
//   res.setHeader('Content-Disposition', `attachment; filename="courses_export_${new Date().toISOString().split('T')[0]}.csv"`);

//   res.send(csvBuffer);
// });

/**
 * @swagger
 * /api/v1/admin/courses/{courseId}:
 *   get:
 *     summary: Retrieve details of a specific course
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       200:
 *         description: Course details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 instructor:
 *                   type: string
 *                 category:
 *                   type: string
 *                 level:
 *                   type: string
 *                 price:
 *                   type: number
 *                 originalPrice:
 *                   type: number
 *                 students:
 *                   type: number
 *                 rating:
 *                   type: number
 *                 revenue:
 *                   type: number
 *                 completionRate:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdDate:
 *                   type: string
 *                 lastUpdated:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 image:
 *                   type: string
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.getCourseById = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  const course = await adminService.getCourseById(courseId);

  successResponse(res, 200, course, 'Chi tiết khóa học được lấy thành công');
});

/**
 * @swagger
 * /api/v1/admin/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               instructor:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [individual, corporate]
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               students:
 *                 type: number
 *               rating:
 *                 type: number
 *               revenue:
 *                 type: number
 *               completionRate:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, draft, archived]
 *               createdDate:
 *                 type: string
 *               lastUpdated:
 *                 type: string
 *               duration:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 instructor:
 *                   type: string
 *                 category:
 *                   type: string
 *                 level:
 *                   type: string
 *                 price:
 *                   type: number
 *                 originalPrice:
 *                   type: number
 *                 students:
 *                   type: number
 *                 rating:
 *                   type: number
 *                 revenue:
 *                   type: number
 *                 completionRate:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdDate:
 *                   type: string
 *                 lastUpdated:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.createCourse = catchAsync(async (req, res) => {
  const courseData = req.body;

  const newCourse = await adminService.createCourse(courseData);

  successResponse(res, 201, newCourse, 'Khóa học được tạo thành công');
});

/**
 * @swagger
 * /api/v1/admin/courses/{courseId}:
 *   patch:
 *     summary: Update course information
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               instructor:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [individual, corporate]
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               students:
 *                 type: number
 *               rating:
 *                 type: number
 *               revenue:
 *                 type: number
 *               completionRate:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, draft, archived]
 *               duration:
 *                 type: string
 *               image:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 instructor:
 *                   type: string
 *                 category:
 *                   type: string
 *                 level:
 *                   type: string
 *                 price:
 *                   type: number
 *                 originalPrice:
 *                   type: number
 *                 students:
 *                   type: number
 *                 rating:
 *                   type: number
 *                 revenue:
 *                   type: number
 *                 completionRate:
 *                   type: number
 *                 status:
 *                   type: string
 *                 createdDate:
 *                   type: string
 *                 lastUpdated:
 *                   type: string
 *                 duration:
 *                   type: string
 *                 image:
 *                   type: string
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.updateCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const updateData = req.body;

  const updatedCourse = await adminService.updateCourse(courseId, updateData);

  successResponse(res, 200, updatedCourse, 'Khóa học được cập nhật thành công');
});

/**
 * @swagger
 * /api/v1/admin/courses/{courseId}:
 *   delete:
 *     summary: Delete a course from the system
 *     tags: [Admin Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the course
 *     responses:
 *       204:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       401:
 *         description: Unauthorized access
 *       403:
 *         description: Forbidden (not an admin)
 *       500:
 *         description: Server error
 */
exports.deleteCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;

  await adminService.deleteCourse(courseId);

  successResponse(res, 204, null, 'Khóa học được xóa thành công');
});

module.exports = exports;