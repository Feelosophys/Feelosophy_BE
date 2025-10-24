// src/services/adminService.js
const User = require('../models/User');
const Course = require('../models/Course');
const AppError = require('../utils/customError');
const ExcelJS = require('exceljs');
// const csv = require('csv-stringify/sync');
const mongoose = require('mongoose');

// --- Hàm tiện ích: Tạo ID người dùng dựa trên vai trò ---
const generateUserId = async (role) => {
  const prefix = role === 'patient' ? 'user' : role === 'expert' ? 'expert' : 'admin';
  const count = await User.countDocuments({ role: { $in: [role, role === 'patient' ? 'user' : 'teacher'] } });
  return `${prefix}-${String(count + 1).padStart(3, '0')}`;
};

// --- Hàm tiện ích: Tạo ID khóa học ---
const generateCourseId = async () => {
  const count = await Course.countDocuments();
  return `course-${String(count + 1).padStart(3, '0')}`;
};

// --- Hàm tiện ích: Ánh xạ dữ liệu người dùng cho frontend ---
const mapUserForFrontend = (user) => {
  return {
    id: user.id || `${user.role === 'user' ? 'user' : user.role === 'teacher' ? 'expert' : 'admin'}-${String(user._id).slice(-3)}`,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role === 'user' ? 'patient' : user.role === 'teacher' ? 'expert' : 'admin',
    status: user.status || 'active',
    avatar: user.avatar || 'https://cdn-icons-png.flaticon.com/512/3781/3781986.png',
    joinDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    lastLogin: user.lastLogin ? user.lastLogin.toISOString().split('T')[0] : null,
    coursesEnrolled: user.coursesEnrolled || 0,
    totalSpent: user.totalSpent || 0,
    city: user.city || user.location || '',
    specialization: user.specialization || '',
    rating: user.rating || null,
    consultations: user.consultations || 0,
    permissions: user.permissions || [],
  };
};

// --- Hàm tiện ích: Ánh xạ dữ liệu khóa học cho frontend ---
const mapCourseForFrontend = (course) => {
  return {
    id: course.id,
    title: course.title,
    instructor: course.instructor,
    category: course.category,
    level: course.level,
    price: course.price,
    originalPrice: course.originalPrice || null,
    students: course.students || 0,
    rating: course.rating || 0,
    revenue: course.revenue || 0,
    completionRate: course.completionRate || 0,
    status: course.status || 'draft',
    createdDate: course.createdDate ? course.createdDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    lastUpdated: course.lastUpdated ? course.lastUpdated.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    duration: course.duration,
    image: course.courseImg || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB6Kq8NJToK5aQZDvrLMFViFup0kXwzQvmQQ&s',
  };
};

// --- Hàm tiện ích: Xử lý sắp xếp và phân trang cho người dùng ---
const buildUserQueryAndSort = (options) => {
  const { search, role, status, sortBy, sortDirection } = options;
  const query = {};

  if (role && role !== 'all') {
    query.role = { $in: [role, role === 'patient' ? 'user' : role === 'expert' ? 'teacher' : 'admin'] };
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { name: { $regex: searchRegex } },
      { email: { $regex: searchRegex } },
      { phone: { $regex: searchRegex } },
    ];
  }

  const sort = {};
  if (sortBy && ['name', 'createdAt', 'lastLogin'].includes(sortBy)) {
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
  } else {
    sort.createdAt = -1;
  }

  return { query, sort };
};

// --- Hàm tiện ích: Xử lý sắp xếp và phân trang cho khóa học ---
const buildCourseQueryAndSort = (options) => {
  const { search, category, status, level, sortBy, sortDirection } = options;
  const query = {};

  if (category && category !== 'all') {
    query.category = category;
  }

  if (status && status !== 'all') {
    query.status = status;
  }

  if (level && level !== 'all') {
    query.level = level;
  }

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [
      { title: { $regex: searchRegex } },
      { instructor: { $regex: searchRegex } },
    ];
  }

  const sort = {};
  if (sortBy && ['title', 'students', 'revenue', 'createdDate'].includes(sortBy)) {
    sort[sortBy] = sortDirection === 'asc' ? 1 : -1;
  } else {
    sort.createdDate = -1;
  }

  return { query, sort };
};

// --- 1. Lấy Danh sách Người dùng có Phân trang, Lọc, Sắp xếp ---
exports.getPaginatedUsers = async (options) => {
  const { page, limit } = options;
  const { query, sort } = buildUserQueryAndSort(options);

  const totalUsers = await User.countDocuments(query);
  const totalPages = Math.ceil(totalUsers / limit);
  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-password');

  const mappedUsers = users.map(mapUserForFrontend);

  return {
    data: mappedUsers,
    totalUsers,
    totalPages,
  };
};

// --- 2. Lấy Thống kê Người dùng ---
exports.getUserStatistics = async () => {
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ status: 'active' });
  const experts = await User.countDocuments({ role: { $in: ['teacher', 'expert'] } });
  const patients = await User.countDocuments({ role: { $in: ['user', 'patient'] } });
  const admins = await User.countDocuments({ role: 'admin' });

  return {
    totalUsers,
    activeUsers,
    experts,
    patients,
    admins,
  };
};

// --- 3. Xuất Danh sách Người dùng ra Excel ---
exports.exportUsersToExcel = async () => {
  const users = await User.find().select('-password');

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh sách người dùng');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 30 },
    { header: 'Họ tên', key: 'name', width: 30 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Số điện thoại', key: 'phone', width: 15 },
    { header: 'Vai trò', key: 'role', width: 15 },
    { header: 'Trạng thái', key: 'status', width: 15 },
    { header: 'Ngày tham gia', key: 'joinDate', width: 20 },
    { header: 'Đăng nhập gần nhất', key: 'lastLogin', width: 20 },
    { header: 'Khóa học đã đăng ký', key: 'coursesEnrolled', width: 20 },
    { header: 'Tổng chi tiêu', key: 'totalSpent', width: 20 },
    { header: 'Thành phố', key: 'city', width: 20 },
    { header: 'Chuyên môn', key: 'specialization', width: 20 },
    { header: 'Đánh giá', key: 'rating', width: 15 },
    { header: 'Số lượng tư vấn', key: 'consultations', width: 15 },
  ];

  const mappedUsers = users.map(mapUserForFrontend);
  mappedUsers.forEach((user) => {
    worksheet.addRow({
      id: user.id,
      name: user.name.normalize('NFC'),
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      joinDate: user.joinDate,
      lastLogin: user.lastLogin || '',
      coursesEnrolled: user.coursesEnrolled,
      totalSpent: user.totalSpent,
      city: user.city,
      specialization: user.specialization || '',
      rating: user.rating || '',
      consultations: user.consultations || '',
    });
  });

  worksheet.getColumn('name').alignment = { wrapText: true };

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

// --- 4. Thêm Người dùng Mới ---
exports.createUser = async (userData) => {
  const { email, role } = userData;

  const existingUserByEmail = await User.findOne({ email });
  if (existingUserByEmail) {
    throw new AppError('Email đã được sử dụng', 400);
  }

  const backendRole = role === 'patient' ? 'user' : role === 'expert' ? 'teacher' : 'admin';
  const id = await generateUserId(role);

  const newUser = await User.create({
    ...userData,
    id,
    role: backendRole,
    status: userData.status || 'pending',
    joinDate: userData.joinDate || new Date(),
    coursesEnrolled: userData.coursesEnrolled || 0,
    totalSpent: userData.totalSpent || 0,
    city: userData.city || '',
    specialization: userData.specialization || '',
    rating: userData.rating || null,
    consultations: userData.consultations || 0,
    permissions: userData.permissions || [],
  });

  return mapUserForFrontend(newUser);
};

// --- 5. Cập nhật Người dùng ---
exports.updateUser = async (userId, updateData) => {
  if (updateData.password) {
    delete updateData.password;
  }

  if (updateData.email) {
    const existingUser = await User.findOne({ email: updateData.email });
    if (existingUser && existingUser.id !== userId) {
      throw new AppError('Email đã được sử dụng bởi tài khoản khác', 400);
    }
  }

  if (updateData.role) {
    updateData.role = updateData.role === 'patient' ? 'user' : updateData.role === 'expert' ? 'teacher' : 'admin';
  }

  const updatedUser = await User.findOneAndUpdate(
    { id: userId },
    { ...updateData, $set: { id: userId } },
    {
      new: true,
      runValidators: true,
    }
  ).select('-password');

  if (!updatedUser) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  return mapUserForFrontend(updatedUser);
};

// --- 6. Xóa Người dùng ---
exports.deleteUser = async (userId) => {
  const deletedUser = await User.findOneAndDelete({ id: userId });
  if (!deletedUser) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }
  return true;
};

// --- 7. Lấy Chi tiết Người dùng ---
exports.getUserById = async (userId) => {
  const user = await User.findOne({ id: userId }).select('-password');
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }
  return mapUserForFrontend(user);
};

// --- 8. Phê duyệt Người dùng ---
exports.approveUser = async (userId) => {
  const user = await User.findOne({ id: userId }).select('-password');
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  if (user.status && user.status !== 'pending') {
    throw new AppError('Người dùng không ở trạng thái chờ duyệt', 400);
  }

  user.status = 'active';
  const updatedUser = await user.save({ validateBeforeSave: true });

  return mapUserForFrontend(updatedUser);
};

// --- 9. Kích hoạt/Vô hiệu hóa Người dùng ---
exports.toggleUserStatus = async (userId) => {
  const user = await User.findOne({ id: userId }).select('-password');
  if (!user) {
    throw new AppError('Không tìm thấy người dùng', 404);
  }

  if (user.status && user.status === 'pending') {
    throw new AppError('Không thể thay đổi trạng thái cho người dùng đang chờ duyệt. Vui lòng sử dụng API phê duyệt.', 400);
  }

  user.status = (user.status || 'active') === 'active' ? 'inactive' : 'active';
  const updatedUser = await user.save({ validateBeforeSave: true });

  return mapUserForFrontend(updatedUser);
};

// --- 10. Lấy Danh sách Khóa học có Phân trang, Lọc, Sắp xếp ---
exports.getPaginatedCourses = async (options) => {
  const { page, limit } = options;
  const { query, sort } = buildCourseQueryAndSort(options);

  const totalCourses = await Course.countDocuments(query);
  const totalPages = Math.ceil(totalCourses / limit);
  const skip = (page - 1) * limit;

  const courses = await Course.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit);

  const mappedCourses = courses.map(mapCourseForFrontend);

  return {
    data: mappedCourses,
    totalCourses,
    totalPages,
  };
};

// --- 11. Lấy Thống kê Khóa học ---
exports.getCourseStatistics = async () => {
  const courses = await Course.find();

  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === 'active').length;
  const totalStudents = courses.reduce((sum, c) => sum + (c.students || 0), 0);
  const totalRevenue = courses.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const averageRating = totalCourses ? courses.reduce((sum, c) => sum + (c.rating || 0), 0) / totalCourses : 0;
  const averageCompletionRate = totalCourses ? courses.reduce((sum, c) => sum + (c.completionRate || 0), 0) / totalCourses : 0;

  return {
    totalCourses,
    activeCourses,
    totalStudents,
    totalRevenue,
    averageRating: Number(averageRating.toFixed(1)),
    averageCompletionRate: Number(averageCompletionRate.toFixed(1)),
  };
};

// --- 12. Xuất Danh sách Khóa học ra CSV ---
// exports.exportCoursesToCSV = async () => {
//   const courses = await Course.find();

//   const headers = [
//     'ID',
//     'Tên khóa học',
//     'Giảng viên',
//     'Danh mục',
//     'Cấp độ',
//     'Giá (VND)',
//     'Giá gốc (VND)',
//     'Số học viên',
//     'Đánh giá',
//     'Doanh thu (VND)',
//     'Tỷ lệ hoàn thành (%)',
//     'Trạng thái',
//     'Ngày tạo',
//     'Cập nhật lần cuối',
//     'Thời lượng',
//   ];

//   const mappedCourses = courses.map(mapCourseForFrontend);
//   const data = mappedCourses.map(course => [
//     course.id,
//     course.title.normalize('NFC'),
//     course.instructor.normalize('NFC'),
//     course.category,
//     course.level,
//     course.price,
//     course.originalPrice || '',
//     course.students,
//     course.rating,
//     course.revenue,
//     course.completionRate,
//     course.status,
//     course.createdDate,
//     course.lastUpdated,
//     course.duration,
//   ]);

//   const csvContent = csv.stringify([headers, ...data], {
//     delimiter: ',',
//     quoted: true,
//   });

//   return Buffer.from('\uFEFF' + csvContent, 'utf-8');
// };

// --- 13. Thêm Khóa học Mới ---
exports.createCourse = async (courseData) => {
  const { title } = courseData;

  const existingCourse = await Course.findOne({ title });
  if (existingCourse) {
    throw new AppError('Tên khóa học đã tồn tại', 400);
  }

  const id = await generateCourseId();

  const newCourse = await Course.create({
    ...courseData,
    id,
    students: courseData.students || 0,
    rating: courseData.rating || 0,
    revenue: courseData.revenue || 0,
    completionRate: courseData.completionRate || 0,
    status: courseData.status || 'draft',
    createdDate: courseData.createdDate || new Date(),
    lastUpdated: courseData.lastUpdated || new Date(),
    image: courseData.image || 'https://via.placeholder.com/150',
  });

  return mapCourseForFrontend(newCourse);
};

// --- 14. Cập nhật Khóa học ---
exports.updateCourse = async (courseId, updateData) => {
  if (updateData.title) {
    const existingCourse = await Course.findOne({ title: updateData.title });
    if (existingCourse && existingCourse.id !== courseId) {
      throw new AppError('Tên khóa học đã được sử dụng bởi khóa học khác', 400);
    }
  }

  const updatedCourse = await Course.findOneAndUpdate(
    { id: courseId },
    { ...updateData, lastUpdated: new Date(), $set: { id: courseId } },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedCourse) {
    throw new AppError('Không tìm thấy khóa học', 404);
  }

  return mapCourseForFrontend(updatedCourse);
};

// --- 15. Xóa Khóa học ---
exports.deleteCourse = async (courseId) => {
  const deletedCourse = await Course.findOneAndDelete({ id: courseId });
  if (!deletedCourse) {
    throw new AppError('Không tìm thấy khóa học', 404);
  }
  return true;
};

// --- 16. Lấy Chi tiết Khóa học ---
exports.getCourseById = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    throw new AppError('courseId không hợp lệ', 400);
  }
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError('Không tìm thấy khóa học', 404);
  }
  return mapCourseForFrontend(course);
};

module.exports = exports;