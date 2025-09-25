// src/services/courseService.js
// Handles business logic for courses
const Course = require('../models/Course');
const UserCourse = require('../models/UserCourse');
const User = require('../models/User');
const CustomError = require('../utils/customError');

class CourseService {
    async getMyCourses(userId, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                status = 'all',
                sortBy = 'enrolledAt', 
                sortOrder = 'desc'
            } = options;

            // Build query for UserCourse
            const query = { userId };
            if (status !== 'all') {
                query.status = status;
            }

            // Build sort object
            const sort = {};
            if (sortBy === 'title') {
                // Sắp xếp theo title course (sẽ handle trong aggregate)
                sort['course.title'] = sortOrder === 'desc' ? -1 : 1;
            } else {
                sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            }

            const skip = (page - 1) * limit;

            // Sử dụng Aggregation Pipeline để join UserCourse với Course
            const pipeline = [
                // Match user's enrollments
                { $match: query },
                
                // Join với Course collection
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                { $unwind: '$course' },
                
                // Join với User collection để lấy instructor info
                {
                    $lookup: {
                        from: 'users',
                        localField: 'course.instructor',
                        foreignField: '_id',
                        as: 'course.instructorInfo'
                    }
                },
                { $unwind: '$course.instructorInfo' },
                
                // Project chỉ những field cần thiết
                {
                    $project: {
                        _id: 1,
                        enrolledAt: 1,
                        status: 1,
                        viaOrganization: 1,
                        paymentId: 1,
                        'course._id': 1,
                        'course.title': 1,
                        'course.description': 1,
                        'course.price': 1,
                        'course.category': 1,
                        'course.isPublished': 1,
                        'course.lessons': 1,
                        'course.createdAt': 1,
                        'course.instructorInfo.name': 1,
                        'course.instructorInfo._id': 1,
                        'course.instructorInfo.avatar': 1
                    }
                },
                
                // Sort results
                { $sort: sort },
                
                // Pagination
                { $skip: skip },
                { $limit: parseInt(limit) }
            ];

            const [enrollments, totalCount] = await Promise.all([
                UserCourse.aggregate(pipeline),
                UserCourse.countDocuments(query)
            ]);

            // Tính toán thêm thông tin cho mỗi course
            const enrichedCourses = enrollments.map(enrollment => ({
                ...enrollment,
                totalLessons: enrollment.course.lessons?.length || 0,
                progressPercentage: 0, // TODO: Implement lesson progress tracking
                enrollmentDuration: Math.floor((new Date() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24)) // days
            }));

            return {
                courses: enrichedCourses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1,
                    limit: parseInt(limit)
                },
                summary: {
                    totalEnrolled: totalCount,
                    completedCourses: enrollments.filter(e => e.status === 'completed').length,
                    activeCourses: enrollments.filter(e => e.status === 'enrolled').length
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching user courses', 500);
        }
    }

    async getCourseProgress(userId, courseId) {
        try {
            // Tìm enrollment của user cho course này
            const enrollment = await UserCourse.findOne({
                userId,
                courseId
            }).populate({
                path: 'courseId',
                select: 'title description lessons',
                populate: {
                    path: 'lessons',
                    select: 'title duration'
                }
            });

            if (!enrollment) {
                throw new CustomError('Course enrollment not found', 404);
            }

            const course = enrollment.courseId;
            const totalLessons = course.lessons?.length || 0;
            
            // TODO: Implement lesson completion tracking
            // Hiện tại return mock data
            const completedLessons = 0; 
            const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
            
            // Tính thời gian học
            const enrollmentDuration = Math.floor((new Date() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24));
            
            return {
                courseId: course._id,
                courseTitle: course.title,
                courseDescription: course.description,
                enrollment: {
                    status: enrollment.status,
                    enrolledAt: enrollment.enrolledAt,
                    viaOrganization: enrollment.viaOrganization,
                    enrollmentDuration: `${enrollmentDuration} days`
                },
                progress: {
                    totalLessons,
                    completedLessons,
                    progressPercentage,
                    nextLesson: totalLessons > 0 ? course.lessons[0] : null // First lesson as next
                },
                lessons: course.lessons || []
            };
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError('Error fetching course progress', 500);
        }
    }

    async getEnrollmentStats(userId) {
        try {
            const stats = await UserCourse.aggregate([
                { $match: { userId } },
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);

            const result = {
                total: 0,
                enrolled: 0,
                completed: 0
            };

            stats.forEach(stat => {
                result.total += stat.count;
                result[stat._id] = stat.count;
            });

            return result;
        } catch (error) {
            throw new CustomError('Error fetching enrollment stats', 500);
        }
    }

    async getAllCourses(options = {}) {
        try {
            const {
                page = 1,
                limit = 12,
                search = '',
                category = '',
                minPrice = 0,
                maxPrice = Number.MAX_SAFE_INTEGER,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = options;

            // Build query object - chỉ courses đã publish
            const query = {
                isPublished: true
            };

            // Text search trong title và description
            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }

            // Filter theo category
            if (category) {
                query.category = { $regex: category, $options: 'i' };
            }

            // Filter theo price range
            if (minPrice > 0 || maxPrice < Number.MAX_SAFE_INTEGER) {
                query.price = {
                    $gte: parseFloat(minPrice),
                    $lte: parseFloat(maxPrice)
                };
            }

            // Build sort object
            const sort = {};
            if (sortBy === 'enrolledUsers') {
                sort['enrolledUsersCount'] = sortOrder === 'desc' ? -1 : 1;
            } else {
                sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            }

            const skip = (page - 1) * limit;

            // Aggregation pipeline
            const pipeline = [
                { $match: query },
                
                // Add computed fields
                {
                    $addFields: {
                        enrolledUsersCount: { $size: '$enrolledUsers' },
                        lessonsCount: { $size: '$lessons' }
                    }
                },
                
                // Lookup instructor info
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructor',
                        foreignField: '_id',
                        as: 'instructorInfo'
                    }
                },
                { $unwind: '$instructorInfo' },
                
                // Project only needed fields
                {
                    $project: {
                        title: 1,
                        description: 1,
                        price: 1,
                        category: 1,
                        createdAt: 1,
                        updatedAt: 1,
                        lessonsCount: 1,
                        enrolledUsersCount: 1,
                        'instructorInfo.name': 1,
                        'instructorInfo._id': 1,
                        'instructorInfo.avatar': 1
                    }
                },
                
                // Sort results
                { $sort: sort },
                
                // Pagination
                { $skip: skip },
                { $limit: parseInt(limit) }
            ];

            const [courses, totalCount, categories] = await Promise.all([
                Course.aggregate(pipeline),
                Course.countDocuments(query),
                this.getAvailableCategories()
            ]);

            return {
                courses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1,
                    limit: parseInt(limit)
                },
                filters: {
                    availableCategories: categories,
                    appliedFilters: {
                        search: search || null,
                        category: category || null,
                        minPrice: minPrice > 0 ? minPrice : null,
                        maxPrice: maxPrice < Number.MAX_SAFE_INTEGER ? maxPrice : null,
                        sortBy,
                        sortOrder
                    }
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching courses', 500);
        }
    }

    async getCourseById(courseId) {
        try {
            console.log('🔍 Fetching course with ID:', courseId);
            
            // Step 1: Get basic course data first
            const basicCourse = await Course.findById(courseId);
            console.log('📋 Basic course found:', basicCourse ? 'Yes' : 'No');
            
            if (!basicCourse) {
                throw new CustomError('Course not found', 404);
            }

            if (!basicCourse.isPublished) {
                throw new CustomError('Course not available', 403);
            }

            console.log('✅ Course is published, proceeding with populate');

            // Step 2: Try to populate instructor safely
            let instructor = null;
            try {
                if (basicCourse.instructor) {
                    const instructorResult = await User.findById(basicCourse.instructor).select('name email avatar bio');
                    instructor = instructorResult;
                    console.log('👨‍🏫 Instructor populated:', instructor ? 'Yes' : 'No');
                } else {
                    console.log('⚠️  No instructor assigned to course');
                }
            } catch (instructorError) {
                console.log('❌ Instructor populate failed:', instructorError.message);
                instructor = null;
            }

            // Step 3: Handle lessons safely (don't populate - just use array length)
            let lessons = [];
            let totalLessons = 0;
            try {
                if (basicCourse.lessons && Array.isArray(basicCourse.lessons)) {
                    totalLessons = basicCourse.lessons.length;
                    console.log('📚 Total lessons count:', totalLessons);
                    // Don't populate lessons to avoid reference errors
                    lessons = basicCourse.lessons.map(lessonId => ({ _id: lessonId }));
                }
            } catch (lessonsError) {
                console.log('❌ Lessons handling failed:', lessonsError.message);
                lessons = [];
                totalLessons = 0;
            }

            // Step 4: Calculate statistics safely
            const stats = {
                totalEnrollments: basicCourse.enrolledUsers ? basicCourse.enrolledUsers.length : 0,
                totalLessons: totalLessons,
                createdAt: basicCourse.createdAt,
                lastUpdated: basicCourse.updatedAt
            };

            // Step 5: Build safe response
            const result = {
                _id: basicCourse._id,
                title: basicCourse.title,
                description: basicCourse.description,
                price: basicCourse.price,
                category: basicCourse.category,
                isPublished: basicCourse.isPublished,
                instructor: instructor,
                lessons: lessons,
                stats,
                createdAt: basicCourse.createdAt,
                updatedAt: basicCourse.updatedAt
            };

            console.log('✅ Course details prepared successfully');
            return result;

        } catch (error) {
            console.error('💥 Error in getCourseById:', error);
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(`Error fetching course details: ${error.message}`, 500);
        }
    }

    async getAvailableCategories() {
        try {
            const categories = await Course.distinct('category', { 
                isPublished: true,
                category: { $exists: true, $ne: null, $ne: '' }
            });
            
            return categories.filter(cat => cat && cat.trim() !== '').sort();
        } catch (error) {
            return [];
        }
    }

    async getCourseStats() {
        try {
            const stats = await Course.aggregate([
                { $match: { isPublished: true } },
                {
                    $group: {
                        _id: null,
                        totalCourses: { $sum: 1 },
                        averagePrice: { $avg: '$price' },
                        totalEnrollments: { $sum: { $size: '$enrolledUsers' } },
                        categories: { $addToSet: '$category' }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalCourses: 1,
                        averagePrice: { $round: ['$averagePrice', 2] },
                        totalEnrollments: 1,
                        totalCategories: { 
                            $size: {
                                $filter: {
                                    input: '$categories',
                                    cond: { $and: [{ $ne: ['$$this', null] }, { $ne: ['$$this', ''] }] }
                                }
                            }
                        }
                    }
                }
            ]);

            return stats[0] || {
                totalCourses: 0,
                averagePrice: 0,
                totalEnrollments: 0,
                totalCategories: 0
            };
        } catch (error) {
            throw new CustomError('Error fetching course statistics', 500);
        }
    }
}

module.exports = new CourseService();