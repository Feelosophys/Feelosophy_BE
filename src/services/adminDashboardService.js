const User = require('../models/User');
const Course = require('../models/Course');
const UserCourse = require('../models/UserCourse');
const Payment = require('../models/Payment');
const AppError = require('../utils/customError');

const getTimeRangeFilter = (model, timeRange) => {
    const now = new Date();
    let startDate;
    switch (timeRange) {
        case '7days':
            startDate = new Date(now.setDate(now.getDate() - 7));
            break;
        case '30days':
            startDate = new Date(now.setDate(now.getDate() - 30));
            break;
        case '3months':
            startDate = new Date(now.setMonth(now.getMonth() - 3));
            break;
        case '12months':
        default:
            startDate = new Date(now.setMonth(now.getMonth() - 12));
            break;
    }
    return model === 'UserCourse' ? { enrolledAt: { $gte: startDate } } : { createdAt: { $gte: startDate } };
};

exports.getDashboardStats = async (timeRange) => {
    const userFilter = getTimeRangeFilter('User', timeRange);
    const courseFilter = getTimeRangeFilter('Course', timeRange);
    const userCourseFilter = getTimeRangeFilter('UserCourse', timeRange);
    const paymentFilter = getTimeRangeFilter('Payment', timeRange);

    const totalUsers = await User.countDocuments({ ...userFilter, role: { $in: ['user', 'teacher'] } });
    const totalExperts = await User.countDocuments({ ...userFilter, role: 'teacher' });
    const totalCourses = await Course.countDocuments({ ...courseFilter });

    // Tính doanh thu từ Payment.amount
    const totalRevenue = await Payment.aggregate([
        { $match: { ...paymentFilter, status: 'paid' } },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    const monthlyRevenue = await Payment.aggregate([
        {
            $match: {
                ...paymentFilter,
                status: 'paid',
                createdAt: { $gte: new Date(new Date().setDate(1)) }
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: '$amount' }
            }
        }
    ]);

    const activeUsers = await User.countDocuments({ ...userFilter, coursesEnrolled: { $gt: 0 } });
    const coursesCompleted = await UserCourse.countDocuments({ ...userCourseFilter, status: 'completed' });
    const averageRating = await Course.aggregate([
        { $match: courseFilter },
        { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);

    return {
        totalUsers,
        totalExperts,
        totalCourses,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        growthRate: 12.5, // Giả định, cần tính toán thực tế
        activeUsers: activeUsers || 0,
        coursesCompleted,
        averageRating: averageRating[0]?.avgRating || 0,
        responseTime: '2.3h' // Giả định, cần logic từ hệ thống chat/support
    };
};

exports.getUserGrowth = async (timeRange) => {
    const userFilter = getTimeRangeFilter('User', timeRange);
    const paymentFilter = getTimeRangeFilter('Payment', timeRange);
    const months = [];
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
        const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
        months.push({
            month: `T${12 - i}`,
            userFilter: { createdAt: { $gte: monthStart, $lte: monthEnd } },
            paymentFilter: { createdAt: { $gte: monthStart, $lte: monthEnd } }
        });
    }

    const data = await Promise.all(months.map(async ({ month, userFilter, paymentFilter }) => {
        const users = await User.countDocuments({ ...userFilter, role: { $in: ['user', 'teacher'] } });
        const experts = await User.countDocuments({ ...userFilter, role: 'teacher' });
        const revenue = await Payment.aggregate([
            { $match: { ...paymentFilter, status: 'paid' } },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);
        return { month, users, experts, revenue: revenue[0]?.total || 0 };
    }));

    return data;
};

exports.getCourseStats = async (timeRange, limit) => {
    const paymentFilter = getTimeRangeFilter('Payment', timeRange);
    const data = await Payment.aggregate([
        { $match: { ...paymentFilter, status: 'paid' } },
        {
            $lookup: {
                from: 'courses',
                localField: 'courseId',
                foreignField: '_id',
                as: 'course'
            }
        },
        { $unwind: '$course' },
        {
            $group: {
                _id: '$course.category',
                students: { $sum: 1 },
                revenue: { $sum: '$amount' }
            }
        },
        { $sort: { students: -1 } },
        { $limit: limit },
        { $project: { category: '$_id', students: 1, revenue: 1, _id: 0 } }
    ]);

    return data;
};

exports.getUserTypeDistribution = async (timeRange) => {
    const userFilter = getTimeRangeFilter('User', timeRange);
    const totalUsers = await User.countDocuments({ ...userFilter });
    const users = await User.countDocuments({ ...userFilter, role: 'user' });
    const teachers = await User.countDocuments({ ...userFilter, role: 'teacher' });
    const admins = await User.countDocuments({ ...userFilter, role: 'admin' });

    return [
        { name: 'Người dùng', value: users, percentage: totalUsers ? (users / totalUsers * 100).toFixed(1) : 0, color: '#3b82f6' },
        { name: 'Giảng viên', value: teachers, percentage: totalUsers ? (teachers / totalUsers * 100).toFixed(1) : 0, color: '#10b981' },
        { name: 'Admin', value: admins, percentage: totalUsers ? (admins / totalUsers * 100).toFixed(1) : 0, color: '#8b5cf6' }
    ];
};

exports.getRecentActivities = async (limit, type) => {
    const query = type === 'all' ? {} : { status: type === 'course_completion' ? 'completed' : 'enrolled' };
    const userCourses = await UserCourse.find(query)
        .sort({ enrolledAt: -1 })
        .limit(limit)
        .populate('userId', 'name')
        .populate('courseId', 'title');

    return userCourses.map((uc, index) => ({
        id: index + 1,
        type: uc.status === 'completed' ? 'course_completion' : 'course_purchase',
        user: uc.userId?.name || 'Unknown',
        time: `${Math.floor((Date.now() - new Date(uc.enrolledAt)) / 60000)} phút trước`,
        description: uc.status === 'completed' 
            ? `Hoàn thành khóa học "${uc.courseId?.title || 'Unknown'}"`
            : `Mua khóa học "${uc.courseId?.title || 'Unknown'}"`
    }));
};