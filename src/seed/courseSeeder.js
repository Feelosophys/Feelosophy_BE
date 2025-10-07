// src/seed/courseSeeder.js
const Course = require('../models/Course');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Video = require('../models/Video');
const Document = require('../models/Document');

async function seedCourses() {
    // Get instructors
    const instructors = await User.find({
        role: 'teacher'
    });

    if (instructors.length === 0) {
        console.log('Warning: No instructors found. Seed users first.');
        return;
    }

    const courses = [{
            title: 'Introduction to Mental Health',
            description: 'A comprehensive guide to understanding mental health basics and common disorders',
            courseImg: 'https://weekly.wesleymc.org/images/events/introduction-to-mental-health-tn.jpg',
            price: 99000,
            originalPrice: 129000,
            rating: 4.5,
            students: 1250,
            category: 'Mental Health',
            ageRange: '18-50',
            topics: ['Mental Health Basics', 'Common Disorders', 'Stigma Reduction'],
            objectives: ['Understand basic mental health concepts', 'Identify common mental health disorders', 'Learn about mental health stigma'],
            requirements: ['Basic reading skills', 'Internet access'],
            curriculum: ['Introduction to Mental Health', 'Common Mental Disorders', 'Seeking Help', 'Prevention Strategies'],
            reviews: [{
                    studentName: 'Sarah Johnson',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Excellent course! Very informative and well-structured.',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Mike Chen',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Great content, but could use more interactive elements.',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Emma Davis',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Life-changing course. Highly recommend!',
                    verified: false,
                    date: new Date('2025-10-03')
                }
            ],
            courseDuration: '4 weeks',
            courseType: 'individual',
            features: ['Video Lectures', 'Quizzes', 'Certificate of Completion'],
            totalHours: 12,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Managing Anxiety in Daily Life',
            description: 'Practical techniques and strategies for dealing with anxiety disorders',
            courseImg: 'https://www.simplypsychology.org/wp-content/uploads/anxiety-self-help.jpg',
            price: 149000,
            originalPrice: 199000,
            rating: 4.7,
            students: 890,
            category: 'Wellness',
            ageRange: '13-19',
            topics: ['Anxiety Types', 'Coping Strategies', 'Mindfulness Techniques'],
            objectives: ['Identify different types of anxiety', 'Learn practical coping strategies', 'Develop mindfulness practices'],
            requirements: ['Commitment to daily practice', 'Journal for tracking progress'],
            curriculum: ['Understanding Anxiety', 'Breathing Techniques', 'Cognitive Strategies', 'Lifestyle Changes'],
            reviews: [{
                    studentName: 'Alex Thompson',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'This course helped me manage my anxiety so much better!',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Lisa Wong',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Good techniques, but takes time to see results.',
                    verified: true,
                    date: new Date('2025-10-03')
                }
            ],
            courseDuration: '6 weeks',
            courseType: 'group',
            features: ['Live Sessions', 'Peer Support', 'Personal Coach', 'Progress Tracking'],
            minParticipants: 5,
            maxParticipants: 15,
            totalHours: 18,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Mindfulness and Meditation Fundamentals',
            description: 'Learn the basics of mindfulness practice and meditation for mental well-being',
            courseImg: 'https://www.planttherapy.com/cdn/shop/articles/PlantTherapy-Mindfulness_and_meditation-DownloadDIY-Featured-01-1-scaled.jpg?v=1683725964&width=1100',
            price: 79000,
            originalPrice: 99000,
            rating: 4.3,
            students: 2100,
            category: 'Self-Care',
            ageRange: '6-12',
            topics: ['Mindfulness Basics', 'Meditation Techniques', 'Body Awareness'],
            objectives: ['Learn mindfulness fundamentals', 'Practice basic meditation', 'Develop body awareness'],
            requirements: ['Quiet space for practice', 'Comfortable seating'],
            curriculum: ['What is Mindfulness', 'Breathing Exercises', 'Body Scan Meditation', 'Mindful Walking'],
            reviews: [{
                    studentName: 'David Kim',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Perfect for beginners. Easy to follow.',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Rachel Green',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'My kids love the meditation sessions!',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Tom Wilson',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Great content, audio quality could be better.',
                    verified: false,
                    date: new Date('2025-10-03')
                }
            ],
            courseDuration: '3 weeks',
            courseType: 'individual',
            features: ['Guided Meditations', 'Practice Worksheets', 'Audio Downloads'],
            totalHours: 9,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Corporate Mental Health Program',
            description: 'Comprehensive mental health training program designed for corporate environments',
            courseImg: 'https://hclhealthcare.in/wp-content/uploads/2023/11/wellness.jpeg',
            price: 499000,
            originalPrice: 699000,
            rating: 4.8,
            students: 450,
            category: 'Therapy',
            ageRange: '18-50',
            topics: ['Workplace Stress', 'Team Mental Health', 'Leadership Wellness'],
            objectives: ['Understand workplace mental health', 'Learn stress management', 'Develop wellness programs'],
            requirements: ['Management position or HR role', 'Company approval'],
            curriculum: ['Workplace Mental Health Overview', 'Stress Management', 'Building Support Systems', 'Program Implementation'],
            reviews: [{
                    studentName: 'Jennifer Corporate',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Transformed our company culture!',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Mark Executive',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Excellent ROI on mental health investment.',
                    verified: true,
                    date: new Date('2025-10-03')
                }
            ],
            courseDuration: '8 weeks',
            courseType: 'corporate',
            features: ['Customizable Content', 'Implementation Guide', 'Team Workshops', 'Ongoing Support'],
            corporateFeatures: ['White-label content', 'Custom branding', 'Analytics dashboard', 'Priority support'],
            minParticipants: 10,
            maxParticipants: 100,
            totalHours: 24,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Teen Mental Health Workshop',
            description: 'Interactive workshop designed specifically for teenagers dealing with mental health challenges',
            courseImg: 'https://events.mesalibrary.org/sites/default/files/styles/large/public/2023-06/Untitled%20design%20%282%29.png',
            price: 89000,
            originalPrice: 119000,
            rating: 4.6,
            students: 675,
            category: 'Mental Health',
            ageRange: '13-19',
            topics: ['Teen Mental Health', 'Peer Pressure', 'Building Resilience', 'Communication Skills'],
            objectives: ['Understand teenage mental health issues', 'Learn coping strategies', 'Develop healthy communication skills'],
            requirements: ['Age 13-19', 'Parent/guardian consent'],
            curriculum: ['Understanding Teen Emotions', 'Dealing with Peer Pressure', 'Building Self-Esteem', 'Seeking Support'],
            reviews: [{
                    studentName: 'Teen Learner',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'This course really helped me understand my feelings better.',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Parent Supporter',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Great resource for teens. Wish it was available when I was younger.',
                    verified: false,
                    date: new Date('2025-10-03')
                }
            ],
            courseDuration: '5 weeks',
            courseType: 'group',
            features: ['Interactive Sessions', 'Peer Discussions', 'Parent Resources', 'Confidential Support'],
            minParticipants: 8,
            maxParticipants: 20,
            totalHours: 15,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Children\'s Emotional Intelligence',
            description: 'Fun and engaging program to help children understand and manage their emotions',
            courseImg: 'https://teachkloud.com/wp-content/uploads/2024/09/Social-Emotional-Learning-Self-Regulation-Education-Presentation-Colorful-Illustrative-Style-1024x576.jpg',
            price: 69000,
            originalPrice: 89000,
            rating: 4.4,
            students: 1200,
            category: 'Wellness',
            ageRange: '6-12',
            topics: ['Emotional Awareness', 'Feeling Identification', 'Expression Skills', 'Empathy Building'],
            objectives: ['Help children identify emotions', 'Teach healthy expression methods', 'Build empathy and understanding'],
            requirements: ['Age 6-12', 'Parent participation encouraged'],
            curriculum: ['What are Emotions', 'Identifying Feelings', 'Expressing Emotions', 'Understanding Others'],
            reviews: [{
                    studentName: 'Parent Educator',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'My child loves this program! So engaging and educational.',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Teacher User',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Perfect for classroom use. Children learn so much.',
                    verified: true,
                    date: new Date('2025-10-03')
                }
            ],
            courseDuration: '4 weeks',
            courseType: 'individual',
            features: ['Animated Videos', 'Interactive Games', 'Parent Guides', 'Progress Certificates'],
            totalHours: 8,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Quản lý Stress và Lo âu Cơ bản',
            description: 'Khóa học toàn diện về cách nhận biết, hiểu và quản lý stress, lo âu trong cuộc sống hàng ngày. Học viên sẽ được trang bị kiến thức và kỹ năng thực tế để đối phó với các tình huống gây căng thẳng, xây dựng sức khỏe tinh thần vững mạnh.',
            courseImg: 'https://example.com/images/stress-management-course.jpg',
            price: 10000,
            originalPrice: 15000,
            rating: 4.8,
            students: 450,
            category: 'Mental Health',
            ageRange: '18-50',
            topics: [
                'Nhận biết dấu hiệu stress',
                'Kỹ thuật thư giãn và hít thở',
                'Thiền chánh niệm cơ bản',
                'Xây dựng thói quen lành mạnh',
                'Quản lý thời gian hiệu quả',
                'Xây dựng mạng lưới hỗ trợ'
            ],
            objectives: [
                'Nhận biết được các dấu hiệu của stress và lo âu',
                'Áp dụng các kỹ thuật thư giãn hiệu quả trong cuộc sống hàng ngày',
                'Thực hành thiền chánh niệm để cải thiện sức khỏe tinh thần',
                'Xây dựng và duy trì thói quen sống lành mạnh',
                'Phát triển kỹ năng quản lý thời gian và ưu tiên công việc',
                'Xây dựng mạng lưới hỗ trợ xã hội khi cần thiết'
            ],
            requirements: [
                'Không yêu cầu kinh nghiệm trước',
                'Cam kết dành 30-45 phút mỗi ngày cho việc học và thực hành',
                'Có không gian yên tĩnh để thực hành thiền',
                'Sẵn sàng thay đổi thói quen để cải thiện sức khỏe tinh thần'
            ],
            curriculum: [
                'Tuần 1: Hiểu về Stress và Cơ chế Hoạt động',
                'Tuần 2: Kỹ thuật Thư giãn và Hít thở',
                'Tuần 3: Thiền Chánh niệm và Tư duy Tích cực',
                'Tuần 4: Xây dựng Thói quen và Phòng ngừa Stress'
            ],
            reviews: [{
                    studentName: 'Nguyễn Thị Mai',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Khóa học rất thực tế và dễ áp dụng. Tôi đã thấy sự thay đổi rõ rệt trong cách quản lý stress của mình.',
                    verified: true,
                    date: new Date('2025-10-01')
                },
                {
                    studentName: 'Trần Văn Hùng',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Giảng viên hướng dẫn rất tận tình. Các bài tập thực hành rất hữu ích.',
                    verified: true,
                    date: new Date('2025-10-02')
                },
                {
                    studentName: 'Lê Thị Lan',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 4,
                    comment: 'Nội dung khoa học, dễ hiểu. Khuyến khích mọi người học.',
                    verified: true,
                    date: new Date('2025-10-03')
                },
                {
                    studentName: 'Phạm Minh Tuấn',
                    avatar: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
                    rating: 5,
                    comment: 'Đã giúp tôi rất nhiều trong việc cân bằng cuộc sống. Cảm ơn khóa học!',
                    verified: true,
                    date: new Date('2025-10-04')
                }
            ],
            courseDuration: '4 tuần',
            courseType: 'individual',
            features: [
                'Video bài giảng chất lượng HD',
                'Bài tập thực hành hàng ngày',
                'Tài liệu PDF chi tiết',
                'Audio hướng dẫn thiền',
                'Nhật ký theo dõi tiến độ',
                'Hỗ trợ Q&A với giảng viên',
                'Cộng đồng học viên',
                'Chứng chỉ hoàn thành'
            ],
            corporateFeatures: [],
            minParticipants: null,
            maxParticipants: null,
            totalHours: 12,
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        }
    ];

    for (let i = 0; i < courses.length; i++) {
        const courseData = courses[i];
        const instructor = instructors[i % instructors.length]; // Cycle through instructors

        const exists = await Course.findOne({
            title: courseData.title
        });
        if (!exists) {
            courseData.instructor = instructor._id;
            await Course.create(courseData);
            console.log(`Created course: ${courseData.title}`);
        } else {
            console.log(`Course exists: ${courseData.title}`);
        }
    }

    // Create detailed lessons, videos, and documents for the stress management course
    const stressCourse = await Course.findOne({
        title: 'Quản lý Stress và Lo âu Cơ bản'
    });
    if (stressCourse && stressCourse.lessons.length === 0) {
        console.log('Creating detailed content for stress management course...');

        // Lesson 1: Hiểu về Stress và Cơ chế Hoạt động
        const lesson1 = await Lesson.create({
            course: stressCourse._id,
            title: 'Tuần 1: Hiểu về Stress và Cơ chế Hoạt động',
            videos: [],
            documents: []
        });

        // Videos for Lesson 1
        const video1_1 = await Video.create({
            title: 'Stress là gì? Nguyên nhân và tác động',
            url: 'https://example.com/videos/stress-basics.mp4',
            duration: 1800, // 30 minutes
            lessonId: lesson1._id
        });

        const video1_2 = await Video.create({
            title: 'Cơ chế hoạt động của stress trong cơ thể',
            url: 'https://example.com/videos/stress-mechanism.mp4',
            duration: 1500, // 25 minutes
            lessonId: lesson1._id
        });

        // Documents for Lesson 1
        const doc1_1 = await Document.create({
            name: 'Bài giảng: Tổng quan về Stress',
            fileUrl: 'https://example.com/docs/stress-overview.pdf',
            lessonId: lesson1._id
        });

        const doc1_2 = await Document.create({
            name: 'Bài tập: Nhận biết dấu hiệu stress cá nhân',
            fileUrl: 'https://example.com/docs/stress-signs-worksheet.pdf',
            lessonId: lesson1._id
        });

        // Update lesson with videos and documents
        lesson1.videos = [video1_1._id, video1_2._id];
        lesson1.documents = [doc1_1._id, doc1_2._id];
        await lesson1.save();

        // Lesson 2: Kỹ thuật Thư giãn và Hít thở
        const lesson2 = await Lesson.create({
            course: stressCourse._id,
            title: 'Tuần 2: Kỹ thuật Thư giãn và Hít thở',
            videos: [],
            documents: []
        });

        const video2_1 = await Video.create({
            title: 'Kỹ thuật hít thở 4-7-8',
            url: 'https://example.com/videos/breathing-478.mp4',
            duration: 1200, // 20 minutes
            lessonId: lesson2._id
        });

        const video2_2 = await Video.create({
            title: 'Progressive Muscle Relaxation',
            url: 'https://example.com/videos/pmr-relaxation.mp4',
            duration: 1800, // 30 minutes
            lessonId: lesson2._id
        });

        const doc2_1 = await Document.create({
            name: 'Hướng dẫn: Các bài tập hít thở',
            fileUrl: 'https://example.com/docs/breathing-exercises.pdf',
            lessonId: lesson2._id
        });

        const doc2_2 = await Document.create({
            name: 'Nhật ký theo dõi thư giãn hàng ngày',
            fileUrl: 'https://example.com/docs/relaxation-journal.pdf',
            lessonId: lesson2._id
        });

        lesson2.videos = [video2_1._id, video2_2._id];
        lesson2.documents = [doc2_1._id, doc2_2._id];
        await lesson2.save();

        // Lesson 3: Thiền Chánh niệm và Tư duy Tích cực
        const lesson3 = await Lesson.create({
            course: stressCourse._id,
            title: 'Tuần 3: Thiền Chánh niệm và Tư duy Tích cực',
            videos: [],
            documents: []
        });

        const video3_1 = await Video.create({
            title: 'Giới thiệu về Thiền chánh niệm',
            url: 'https://example.com/videos/mindfulness-intro.mp4',
            duration: 1500, // 25 minutes
            lessonId: lesson3._id
        });

        const video3_2 = await Video.create({
            title: 'Thay đổi tư duy tiêu cực thành tích cực',
            url: 'https://example.com/videos/positive-thinking.mp4',
            duration: 1800, // 30 minutes
            lessonId: lesson3._id
        });

        const doc3_1 = await Document.create({
            name: 'Bài giảng: Thiền chánh niệm cho người mới bắt đầu',
            fileUrl: 'https://example.com/docs/mindfulness-guide.pdf',
            lessonId: lesson3._id
        });

        const doc3_2 = await Document.create({
            name: 'Bài tập: Thay đổi pattern tư duy',
            fileUrl: 'https://example.com/docs/thought-patterns-exercise.pdf',
            lessonId: lesson3._id
        });

        lesson3.videos = [video3_1._id, video3_2._id];
        lesson3.documents = [doc3_1._id, doc3_2._id];
        await lesson3.save();

        // Lesson 4: Xây dựng Thói quen và Phòng ngừa Stress
        const lesson4 = await Lesson.create({
            course: stressCourse._id,
            title: 'Tuần 4: Xây dựng Thói quen và Phòng ngừa Stress',
            videos: [],
            documents: []
        });

        const video4_1 = await Video.create({
            title: 'Xây dựng routine hàng ngày chống stress',
            url: 'https://example.com/videos/daily-routine.mp4',
            duration: 1200, // 20 minutes
            lessonId: lesson4._id
        });

        const video4_2 = await Video.create({
            title: 'Quản lý thời gian và ưu tiên công việc',
            url: 'https://example.com/videos/time-management.mp4',
            duration: 1500, // 25 minutes
            lessonId: lesson4._id
        });

        const doc4_1 = await Document.create({
            name: 'Hướng dẫn: Tạo kế hoạch phòng ngừa stress',
            fileUrl: 'https://example.com/docs/stress-prevention-plan.pdf',
            lessonId: lesson4._id
        });

        const doc4_2 = await Document.create({
            name: 'Checklist: Thói quen lành mạnh',
            fileUrl: 'https://example.com/docs/healthy-habits-checklist.pdf',
            lessonId: lesson4._id
        });

        lesson4.videos = [video4_1._id, video4_2._id];
        lesson4.documents = [doc4_1._id, doc4_2._id];
        await lesson4.save();

        // Update course with lessons
        stressCourse.lessons = [lesson1._id, lesson2._id, lesson3._id, lesson4._id];
        await stressCourse.save();

        console.log('✅ Created complete course content with 4 lessons, 8 videos, and 8 documents');
    }
}

module.exports = {
    seedCourses
};