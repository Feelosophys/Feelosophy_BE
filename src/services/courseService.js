// src/services/courseService.js
// Handles business logic for courses
const mongoose = require('mongoose');
const Course = require('../models/Course');
const UserCourse = require('../models/UserCourse');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
require('../models/Video');
require('../models/Document');
const CustomError = require('../utils/customError');

const buildLessonContent = (lessonDocs = []) => {
    let totalVideos = 0;
    let totalDocuments = 0;

    const lessons = lessonDocs
        .filter(Boolean)
        .map((lesson, index) => {
            const videos = Array.isArray(lesson.videos) ? lesson.videos.filter(Boolean).map(video => ({
                _id: video._id,
                title: video.title,
                url: video.url,
                duration: video.duration || 0,
                createdAt: video.createdAt,
                updatedAt: video.updatedAt
            })) : [];

            const documents = Array.isArray(lesson.documents) ? lesson.documents.filter(Boolean).map(document => ({
                _id: document._id,
                name: document.name,
                fileUrl: document.fileUrl,
                createdAt: document.createdAt,
                updatedAt: document.updatedAt
            })) : [];

            totalVideos += videos.length;
            totalDocuments += documents.length;

            return {
                _id: lesson._id,
                title: lesson.title,
                order: index + 1,
                videos,
                documents,
                createdAt: lesson.createdAt,
                updatedAt: lesson.updatedAt
            };
        });

    return {
        lessons,
        totalLessons: lessons.length,
        totalVideos,
        totalDocuments
    };
};

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

            const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
            if (!isValidUserId) {
                throw new CustomError('Invalid user identifier provided', 400);
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);

            // Build query for UserCourse
            const query = {
                userId: userObjectId
            };
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
                {
                    $match: {
                        userId: userObjectId
                    }
                },

                // Join với Course collection
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'courseData'
                    }
                },
                {
                    $unwind: '$courseData'
                },

                // Join với User collection để lấy instructor info (cho phép thiếu dữ liệu)
                {
                    $lookup: {
                        from: 'users',
                        localField: 'courseData.instructor',
                        foreignField: '_id',
                        as: 'instructorInfo'
                    }
                },
                {
                    $unwind: {
                        path: '$instructorInfo',
                        preserveNullAndEmptyArrays: true
                    }
                },

                // Project chỉ những field cần thiết
                {
                    $project: {
                        _id: 1,
                        enrolledAt: 1,
                        updatedAt: 1,
                        status: 1,
                        viaOrganization: 1,
                        paymentId: 1,
                        course: {
                            _id: '$courseData._id',
                            title: '$courseData.title',
                            description: '$courseData.description',
                            price: '$courseData.price',
                            originalPrice: '$courseData.originalPrice',
                            rating: '$courseData.rating',
                            category: '$courseData.category',
                            ageRange: '$courseData.ageRange',
                            courseType: '$courseData.courseType',
                            totalHours: '$courseData.totalHours',
                            courseDuration: '$courseData.courseDuration',
                            students: '$courseData.students',
                            courseImg: '$courseData.courseImg',
                            isPublished: '$courseData.isPublished',
                            lessons: '$courseData.lessons',
                            createdAt: '$courseData.createdAt',
                            updatedAt: '$courseData.updatedAt',
                            instructorInfo: {
                                _id: '$instructorInfo._id',
                                name: '$instructorInfo.name',
                                avatar: '$instructorInfo.avatar'
                            }
                        }
                    }
                },

                // Sort results
                {
                    $sort: sort
                },

                // Pagination
                {
                    $skip: skip
                },
                {
                    $limit: parseInt(limit)
                }
            ];

            const statusStatsPipeline = [{
                    $match: {
                        userId: userObjectId
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: {
                            $sum: 1
                        }
                    }
                }
            ];

            const [enrollments, totalCount, statusStats] = await Promise.all([
                UserCourse.aggregate(pipeline),
                UserCourse.countDocuments(query),
                UserCourse.aggregate(statusStatsPipeline)
            ]);

            // Tính toán thêm thông tin cho mỗi course
            const enrichedCourses = enrollments.map(enrollment => {
                const lessonsArray = Array.isArray(enrollment.course?.lessons) ? enrollment.course.lessons : [];
                const totalLessons = lessonsArray.length;
                const progressPercentage = enrollment.status === 'completed' ? 100 : 0;
                const completedLessons = enrollment.status === 'completed' ? totalLessons : 0;
                const lastAccessed = enrollment.updatedAt || enrollment.enrolledAt;

                const rawInstructor = enrollment.course?.instructorInfo;
                const instructorInfo = rawInstructor && rawInstructor._id ? {
                    _id: rawInstructor._id,
                    name: rawInstructor.name,
                    avatar: rawInstructor.avatar || null
                } : null;

                const paymentId = enrollment.paymentId ? enrollment.paymentId.toString() : null;

                const sanitizedCourse = {
                    _id: enrollment.course?._id,
                    title: enrollment.course?.title,
                    description: enrollment.course?.description,
                    price: enrollment.course?.price,
                    originalPrice: enrollment.course?.originalPrice,
                    rating: enrollment.course?.rating,
                    category: enrollment.course?.category,
                    ageRange: enrollment.course?.ageRange,
                    courseType: enrollment.course?.courseType,
                    totalHours: enrollment.course?.totalHours,
                    courseDuration: enrollment.course?.courseDuration,
                    students: enrollment.course?.students || 0,
                    courseImg: enrollment.course?.courseImg || null,
                    isPublished: enrollment.course?.isPublished,
                    createdAt: enrollment.course?.createdAt,
                    updatedAt: enrollment.course?.updatedAt,
                    instructorInfo,
                    totalLessons
                };

                return {
                    _id: enrollment._id,
                    enrolledAt: enrollment.enrolledAt,
                    updatedAt: enrollment.updatedAt,
                    status: enrollment.status,
                    viaOrganization: enrollment.viaOrganization,
                    paymentId,
                    course: sanitizedCourse,
                    totalLessons,
                    completedLessons,
                    progressPercentage,
                    enrollmentDuration: Math.floor((new Date() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24)),
                    lastAccessed
                };
            });

            return {
                courses: enrichedCourses,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.max(1, Math.ceil(totalCount / limit)),
                    totalCount,
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1,
                    limit: parseInt(limit)
                },
                summary: {
                    totalEnrolled: statusStats.reduce((sum, stat) => sum + (stat.count || 0), 0),
                    completedCourses: statusStats.find(stat => stat._id === 'completed')?.count || 0,
                    activeCourses: statusStats.find(stat => stat._id === 'enrolled')?.count || 0
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching user courses', 500);
        }
    }

    // async getCourseProgress(userId, courseId) {
    //     try {
    //         // Tìm enrollment của user cho course này
    //         const enrollment = await UserCourse.findOne({
    //             userId,
    //             courseId
    //         }).populate({
    //             path: 'courseId',
    //             select: 'title description lessons',
    //             populate: {
    //                 path: 'lessons',
    //                 select: 'title duration'
    //             }
    //         });

    //         if (!enrollment) {
    //             throw new CustomError('Course enrollment not found', 404);
    //         }

    //         const course = enrollment.courseId;
    //         totalLessons: enrollment.course.lessons ? .length || 0,

    //             // TODO: Implement lesson completion tracking
    //             // Hiện tại return mock data
    //            // const completedLessons = 0;
    //        // const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    //         // Tính thời gian học
    //         //const enrollmentDuration = Math.floor((new Date() - new Date(enrollment.enrolledAt)) / (1000 * 60 * 60 * 24));

    //         // return {
    //         //     courseId: course._id,
    //         //     courseTitle: course.title,
    //         //     courseDescription: course.description,
    //         //     enrollment: {
    //         //         status: enrollment.status,
    //         //         enrolledAt: enrollment.enrolledAt,
    //         //         viaOrganization: enrollment.viaOrganization,
    //         //         enrollmentDuration: `${enrollmentDuration} days`
    //         //     },
    //         //     progress: {
    //         //         totalLessons,
    //         //         completedLessons,
    //         //         progressPercentage,
    //         //         nextLesson: totalLessons > 0 ? course.lessons[0] : null // First lesson as next
    //         //     },
    //         //     lessons: course.lessons || []
    //         // };
    //     } catch (error) {
    //         if (error instanceof CustomError) {
    //             throw error;
    //         }
    //         throw new CustomError('Error fetching course progress', 500);
    //     }
    // }

    async getEnrollmentStats(userId) {
        try {
            const stats = await UserCourse.aggregate([{
                    $match: {
                        userId
                    }
                },
                {
                    $group: {
                        _id: '$status',
                        count: {
                            $sum: 1
                        }
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
                query.$or = [{
                        title: {
                            $regex: search,
                            $options: 'i'
                        }
                    },
                    {
                        description: {
                            $regex: search,
                            $options: 'i'
                        }
                    }
                ];
            }

            // Filter theo category
            if (category) {
                query.category = {
                    $regex: category,
                    $options: 'i'
                };
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
            const pipeline = [{
                    $match: query
                },

                // Add computed fields
                {
                    $addFields: {
                        enrolledUsersCount: {
                            $size: '$enrolledUsers'
                        },
                        lessonsCount: {
                            $size: '$lessons'
                        }
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
                {
                    $unwind: '$instructorInfo'
                },

                // Project only needed fields
                {
                    $project: {
                        title: 1,
                        description: 1,
                        price: 1,
                        originalPrice: 1,
                        rating: 1,
                        students: '$enrolledUsersCount',
                        instructor: '$instructorInfo.name',
                        instructorImage: '$instructorInfo.avatar',
                        category: 1,
                        ageRange: 1,
                        courseDuration: 1,
                        courseType: 1,
                        totalHours: 1,
                        lessons: '$lessonsCount',
                        features: 1,
                        courseImg: 1,
                        createdAt: 1
                    }
                },

                // Sort results
                {
                    $sort: sort
                },

                // Pagination
                {
                    $skip: skip
                },
                {
                    $limit: parseInt(limit)
                }
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
                    const instructorResult = await User.findById(basicCourse.instructor).select('name email avatar bio').lean();
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
                    lessons = basicCourse.lessons.map(lessonId => ({
                        _id: lessonId
                    }));
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
                createdAt: basicCourse.createdAt || new Date(),
                lastUpdated: basicCourse.updatedAt || new Date()
            };

            // Step 5: Build safe response
            const result = {
                _id: basicCourse._id,
                title: basicCourse.title,
                description: basicCourse.description,
                price: basicCourse.price,
                category: basicCourse.category,
                courseImg: basicCourse.courseImg,
                isPublished: basicCourse.isPublished,
                instructor: instructor,
                lessons: lessons,
                stats,
                createdAt: basicCourse.createdAt || new Date(),
                updatedAt: basicCourse.updatedAt || new Date()
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
                category: {
                    $exists: true,
                    $ne: null,
                    $ne: ''
                }
            });

            return categories.filter(cat => cat && cat.trim() !== '').sort();
        } catch (error) {
            return [];
        }
    }

    async getCourseStats() {
        try {
            const stats = await Course.aggregate([{
                    $match: {
                        isPublished: true
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalCourses: {
                            $sum: 1
                        },
                        averagePrice: {
                            $avg: '$price'
                        },
                        totalEnrollments: {
                            $sum: {
                                $size: '$enrolledUsers'
                            }
                        },
                        categories: {
                            $addToSet: '$category'
                        }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        totalCourses: 1,
                        averagePrice: {
                            $round: ['$averagePrice', 2]
                        },
                        totalEnrollments: 1,
                        totalCategories: {
                            $size: {
                                $filter: {
                                    input: '$categories',
                                    cond: {
                                        $and: [{
                                            $ne: ['$$this', null]
                                        }, {
                                            $ne: ['$$this', '']
                                        }]
                                    }
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

    async getCoursesByType(courseType, options = {}) {
        try {
            const {
                page = 1,
                    limit = 12,
                    ageRange = '',
                    category = '',
                    sortBy = 'rating',
                    sortOrder = 'desc'
            } = options;

            const query = {
                isPublished: true,
                courseType: courseType
            };

            if (ageRange) {
                query.ageRange = ageRange;
            }

            if (category) {
                query.category = {
                    $regex: category,
                    $options: 'i'
                };
            }

            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

            const skip = (page - 1) * limit;

            const pipeline = [{
                    $match: query
                },
                {
                    $addFields: {
                        enrolledUsersCount: {
                            $size: '$enrolledUsers'
                        },
                        lessonsCount: {
                            $size: '$lessons'
                        },
                        reviewsCount: {
                            $size: '$reviews'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructor',
                        foreignField: '_id',
                        as: 'instructorInfo'
                    }
                },
                {
                    $unwind: '$instructorInfo'
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        price: 1,
                        originalPrice: 1,
                        rating: 1,
                        students: '$enrolledUsersCount',
                        instructor: '$instructorInfo.name',
                        instructorImage: '$instructorInfo.avatar',
                        category: 1,
                        ageRange: 1,
                        courseDuration: 1,
                        courseType: 1,
                        totalHours: 1,
                        lessons: '$lessonsCount',
                        features: 1,
                        corporateFeatures: {
                            $cond: {
                                if: {
                                    $eq: ['$courseType', 'corporate']
                                },
                                then: '$corporateFeatures',
                                else: []
                            }
                        },
                        createdAt: 1
                    }
                },
                {
                    $sort: sort
                },
                {
                    $skip: skip
                },
                {
                    $limit: parseInt(limit)
                }
            ];

            const [courses, totalCount] = await Promise.all([
                Course.aggregate(pipeline),
                Course.countDocuments(query)
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
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching courses by type', 500);
        }
    }

    async getTopRatedCourses(limit = 10) {
        try {
            const pipeline = [{
                    $match: {
                        isPublished: true,
                        rating: {
                            $gt: 0
                        }
                    }
                },
                {
                    $addFields: {
                        enrolledUsersCount: {
                            $size: '$enrolledUsers'
                        },
                        lessonsCount: {
                            $size: '$lessons'
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'instructor',
                        foreignField: '_id',
                        as: 'instructorInfo'
                    }
                },
                {
                    $unwind: '$instructorInfo'
                },
                {
                    $project: {
                        title: 1,
                        description: 1,
                        price: 1,
                        rating: 1,
                        students: '$enrolledUsersCount',
                        instructor: '$instructorInfo.name',
                        instructorImage: '$instructorInfo.avatar',
                        category: 1,
                        ageRange: 1,
                        courseDuration: 1,
                        courseType: 1,
                        totalHours: 1,
                        lessons: '$lessonsCount',
                        features: 1
                    }
                },
                {
                    $sort: {
                        rating: -1,
                        students: -1
                    }
                },
                {
                    $limit: parseInt(limit)
                }
            ];

            const courses = await Course.aggregate(pipeline);
            return courses;
        } catch (error) {
            throw new CustomError('Error fetching top rated courses', 500);
        }
    }

    async getCourseLearningContent(userId, courseId) {
        try {
            const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
            const isValidCourseId = mongoose.Types.ObjectId.isValid(courseId);

            if (!isValidUserId || !isValidCourseId) {
                throw new CustomError('Invalid course or user identifier provided', 400);
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);
            const courseObjectId = new mongoose.Types.ObjectId(courseId);

            const enrollment = await UserCourse.findOne({
                    userId: userObjectId,
                    courseId: courseObjectId
                })
                .populate({
                    path: 'paymentId',
                    select: 'status amount method createdAt updatedAt'
                })
                .lean();

            if (!enrollment) {
                throw new CustomError('Bạn chưa đăng ký khóa học này', 403);
            }

            const course = await Course.findById(courseObjectId)
                .populate({
                    path: 'instructor',
                    select: 'name email avatar bio title'
                })
                .lean();

            if (!course) {
                throw new CustomError('Course not found', 404);
            }

            const lessonDocs = await Lesson.find({
                    course: courseObjectId
                })
                .select('title videos documents createdAt updatedAt')
                .populate({
                    path: 'videos',
                    select: 'title url duration createdAt updatedAt'
                })
                .populate({
                    path: 'documents',
                    select: 'name fileUrl createdAt updatedAt'
                })
                .sort({
                    createdAt: 1
                })
                .lean();

            const {
                lessons: curriculum,
                totalLessons,
                totalVideos,
                totalDocuments
            } = buildLessonContent(lessonDocs);
            const progressPercentage = enrollment.status === 'completed' ? 100 : 0;
            const completedLessons = enrollment.status === 'completed' ? totalLessons : 0;

            return {
                course: {
                    _id: course._id,
                    title: course.title,
                    description: course.description,
                    category: course.category,
                    courseImg: course.courseImg,
                    rating: course.rating,
                    totalHours: course.totalHours,
                    courseDuration: course.courseDuration,
                    totalLessons,
                    totalVideos,
                    instructor: course.instructor ? {
                        _id: course.instructor._id,
                        name: course.instructor.name,
                        email: course.instructor.email,
                        avatar: course.instructor.avatar,
                        bio: course.instructor.bio,
                        title: course.instructor.title
                    } : null,
                    stats: {
                        totalEnrollments: Array.isArray(course.enrolledUsers) ? course.enrolledUsers.length : 0,
                        totalLessons,
                        totalVideos,
                        totalDocuments,
                        createdAt: course.createdAt,
                        lastUpdated: course.updatedAt
                    }
                },
                enrollment: {
                    _id: enrollment._id,
                    status: enrollment.status,
                    enrolledAt: enrollment.enrolledAt,
                    updatedAt: enrollment.updatedAt,
                    viaOrganization: enrollment.viaOrganization,
                    payment: enrollment.paymentId ? {
                        _id: enrollment.paymentId._id,
                        status: enrollment.paymentId.status,
                        amount: enrollment.paymentId.amount,
                        method: enrollment.paymentId.method,
                        createdAt: enrollment.paymentId.createdAt,
                        updatedAt: enrollment.paymentId.updatedAt
                    } : null
                },
                progress: {
                    completedLessons,
                    totalLessons,
                    percentage: progressPercentage,
                    lastViewedLessonId: null
                },
                curriculum
            };
        } catch (error) {
            console.error('[CourseService.getCourseLearningContent] Failed', {
                userId,
                courseId,
                message: error?.message,
                stack: error?.stack
            });
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error?.message || 'Error fetching course learning content', 500);
        }
    }

    async getPurchasedCourseDetails(userId, courseId) {
        try {
            const isValidUserId = mongoose.Types.ObjectId.isValid(userId);
            const isValidCourseId = mongoose.Types.ObjectId.isValid(courseId);

            if (!isValidUserId || !isValidCourseId) {
                throw new CustomError('Invalid course or user identifier provided', 400);
            }

            const userObjectId = new mongoose.Types.ObjectId(userId);
            const courseObjectId = new mongoose.Types.ObjectId(courseId);

            const enrollment = await UserCourse.findOne({
                    userId: userObjectId,
                    courseId: courseObjectId
                })
                .populate({
                    path: 'paymentId',
                    select: 'status amount method createdAt updatedAt'
                })
                .lean();

            if (!enrollment) {
                throw new CustomError('Bạn chưa đăng ký khóa học này', 403);
            }

            const course = await Course.findById(courseObjectId)
                .populate({
                    path: 'instructor',
                    select: 'name email avatar bio title'
                })
                .lean();

            if (!course) {
                throw new CustomError('Course not found', 404);
            }

            const lessonDocs = await Lesson.find({
                    course: courseObjectId
                })
                .select('title videos documents createdAt updatedAt')
                .populate({
                    path: 'videos',
                    select: 'title url duration createdAt updatedAt'
                })
                .populate({
                    path: 'documents',
                    select: 'name fileUrl createdAt updatedAt'
                })
                .sort({
                    createdAt: 1
                })
                .lean();

            const {
                lessons,
                totalLessons,
                totalVideos,
                totalDocuments
            } = buildLessonContent(lessonDocs);

            const instructorInfo = course.instructor ? {
                _id: course.instructor._id,
                name: course.instructor.name,
                email: course.instructor.email,
                avatar: course.instructor.avatar,
                bio: course.instructor.bio,
                title: course.instructor.title
            } : null;

            const reviews = Array.isArray(course.reviews) ? course.reviews.filter(Boolean).map(review => ({
                _id: review._id,
                studentName: review.studentName,
                avatar: review.avatar || null,
                rating: review.rating,
                comment: review.comment || null,
                verified: review.verified || false,
                date: review.date
            })) : [];

            const sanitizedCourse = {
                _id: course._id,
                title: course.title,
                description: course.description,
                price: course.price,
                originalPrice: course.originalPrice ?? null,
                rating: course.rating ?? 0,
                students: course.students ?? 0,
                instructor: instructorInfo,
                instructorImage: course.instructorImage || null,
                courseImg: course.courseImg || null,
                category: course.category,
                ageRange: course.ageRange,
                topics: Array.isArray(course.topics) ? course.topics : [],
                objectives: Array.isArray(course.objectives) ? course.objectives : [],
                requirements: Array.isArray(course.requirements) ? course.requirements : [],
                curriculumOutline: Array.isArray(course.curriculum) ? course.curriculum : [],
                reviews,
                courseDuration: course.courseDuration,
                courseType: course.courseType,
                features: Array.isArray(course.features) ? course.features : [],
                corporateFeatures: Array.isArray(course.corporateFeatures) ? course.corporateFeatures : [],
                minParticipants: course.minParticipants ?? null,
                maxParticipants: course.maxParticipants ?? null,
                totalHours: course.totalHours,
                isPublished: course.isPublished,
                createdAt: course.createdAt,
                updatedAt: course.updatedAt,
                stats: {
                    totalEnrollments: Array.isArray(course.enrolledUsers) ? course.enrolledUsers.length : 0,
                    totalLessons,
                    totalVideos,
                    totalDocuments
                },
                lessons
            };

            return {
                course: sanitizedCourse,
                enrollment: {
                    _id: enrollment._id,
                    status: enrollment.status,
                    enrolledAt: enrollment.enrolledAt,
                    updatedAt: enrollment.updatedAt,
                    viaOrganization: enrollment.viaOrganization,
                    payment: enrollment.paymentId ? {
                        _id: enrollment.paymentId._id,
                        status: enrollment.paymentId.status,
                        amount: enrollment.paymentId.amount,
                        method: enrollment.paymentId.method,
                        createdAt: enrollment.paymentId.createdAt,
                        updatedAt: enrollment.paymentId.updatedAt
                    } : null
                }
            };
        } catch (error) {
            console.error('[CourseService.getPurchasedCourseDetails] Failed', {
                userId,
                courseId,
                message: error?.message,
                stack: error?.stack
            });
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(error?.message || 'Error fetching purchased course details', 500);
        }
    }

    async getUserCourses(userId, options = {}) {
        try {
            const {
                page = 1,
                    limit = 10,
                    status = 'completed'
            } = options;

            // Build query for UserCourse
            const query = {
                userId,
                status
            };

            const skip = (page - 1) * limit;

            // Sử dụng Aggregation Pipeline để join UserCourse với Course
            const pipeline = [
                // Match user's enrollments
                {
                    $match: query
                },

                // Join với Course collection
                {
                    $lookup: {
                        from: 'courses',
                        localField: 'courseId',
                        foreignField: '_id',
                        as: 'course'
                    }
                },
                {
                    $unwind: '$course'
                },

                // Join với User collection để lấy instructor info
                {
                    $lookup: {
                        from: 'users',
                        localField: 'course.instructor',
                        foreignField: '_id',
                        as: 'course.instructorInfo'
                    }
                },
                {
                    $unwind: '$course.instructorInfo'
                },

                // Project chỉ những field cần thiết
                {
                    $project: {
                        _id: 1,
                        enrolledAt: 1,
                        status: 1,
                        'course._id': 1,
                        'course.title': 1,
                        'course.description': 1,
                        'course.price': 1,
                        'course.category': 1,
                        'course.ageRange': 1,
                        'course.courseType': 1,
                        'course.rating': 1,
                        'course.totalHours': 1,
                        'course.instructorInfo.name': 1,
                        'course.instructorInfo.avatar': 1
                    }
                },

                // Sort by enrollment date
                {
                    $sort: {
                        enrolledAt: -1
                    }
                },

                // Pagination
                {
                    $skip: skip
                },
                {
                    $limit: parseInt(limit)
                }
            ];

            const [enrollments, totalCount] = await Promise.all([
                UserCourse.aggregate(pipeline),
                UserCourse.countDocuments(query)
            ]);

            return {
                courses: enrollments,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalCount / limit),
                    totalCount,
                    hasNextPage: page < Math.ceil(totalCount / limit),
                    hasPrevPage: page > 1,
                    limit: parseInt(limit)
                }
            };
        } catch (error) {
            throw new CustomError('Error fetching user courses', 500);
        }
    }

    async createCourse(courseData) {
        try {
            const {
                title,
                description,
                price,
                originalPrice,
                category,
                ageRange,
                courseType,
                totalHours,
                courseImg,
                instructor,
                features = [],
                isPublished = false
            } = courseData;

            // Validate required fields
            if (!title || !description || !price || !category || !instructor) {
                throw new CustomError('Missing required fields: title, description, price, category, instructor', 400);
            }

            // Validate instructor exists and is a teacher
            const instructorUser = await User.findById(instructor);
            if (!instructorUser) {
                throw new CustomError('Instructor not found', 404);
            }

            if (instructorUser.role !== 'teacher') {
                throw new CustomError('Instructor must be a teacher', 400);
            }

            // Create new course
            const newCourse = new Course({
                title: title.trim(),
                description: description.trim(),
                price: parseFloat(price),
                originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(price),
                category: category.trim(),
                ageRange: ageRange || null,
                courseType: courseType || 'individual',
                totalHours: totalHours ? parseFloat(totalHours) : 0,
                courseImg: courseImg ? courseImg.trim() : null,
                instructor,
                features,
                isPublished,
                enrolledUsers: [],
                lessons: [],
                rating: 0,
                reviews: []
            });

            const savedCourse = await newCourse.save();

            // Populate instructor info for response
            await savedCourse.populate('instructor', 'name email avatar bio');

            return savedCourse;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw new CustomError(`Error creating course: ${error.message}`, 500);
        }
    }
}

module.exports = new CourseService();