// src/seed/courseSeeder.js
const Course = require('../models/Course');
const User = require('../models/User');

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
            price: 99.99,
            originalPrice: 129.99,
            rating: 4.5,
            students: 1250,
            category: 'Mental Health',
            ageRange: 'adults',
            topics: ['Mental Health Basics', 'Common Disorders', 'Stigma Reduction'],
            objectives: ['Understand basic mental health concepts', 'Identify common mental health disorders', 'Learn about mental health stigma'],
            requirements: ['Basic reading skills', 'Internet access'],
            curriculum: ['Introduction to Mental Health', 'Common Mental Disorders', 'Seeking Help', 'Prevention Strategies'],
            reviews: [{
                    studentName: 'Sarah Johnson',
                    avatar: 'https://example.com/avatar1.jpg',
                    rating: 5,
                    comment: 'Excellent course! Very informative and well-structured.',
                    verified: true,
                    date: new Date('2024-01-15')
                },
                {
                    studentName: 'Mike Chen',
                    avatar: 'https://example.com/avatar2.jpg',
                    rating: 4,
                    comment: 'Great content, but could use more interactive elements.',
                    verified: true,
                    date: new Date('2024-02-20')
                },
                {
                    studentName: 'Emma Davis',
                    avatar: 'https://example.com/avatar3.jpg',
                    rating: 5,
                    comment: 'Life-changing course. Highly recommend!',
                    verified: false,
                    date: new Date('2024-03-10')
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
            price: 149.99,
            originalPrice: 199.99,
            rating: 4.7,
            students: 890,
            category: 'Wellness',
            ageRange: 'teenagers',
            topics: ['Anxiety Types', 'Coping Strategies', 'Mindfulness Techniques'],
            objectives: ['Identify different types of anxiety', 'Learn practical coping strategies', 'Develop mindfulness practices'],
            requirements: ['Commitment to daily practice', 'Journal for tracking progress'],
            curriculum: ['Understanding Anxiety', 'Breathing Techniques', 'Cognitive Strategies', 'Lifestyle Changes'],
            reviews: [{
                    studentName: 'Alex Thompson',
                    avatar: 'https://example.com/avatar4.jpg',
                    rating: 5,
                    comment: 'This course helped me manage my anxiety so much better!',
                    verified: true,
                    date: new Date('2024-01-25')
                },
                {
                    studentName: 'Lisa Wong',
                    avatar: 'https://example.com/avatar5.jpg',
                    rating: 4,
                    comment: 'Good techniques, but takes time to see results.',
                    verified: true,
                    date: new Date('2024-02-15')
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
            price: 79.99,
            originalPrice: 99.99,
            rating: 4.3,
            students: 2100,
            category: 'Self-Care',
            ageRange: 'children',
            topics: ['Mindfulness Basics', 'Meditation Techniques', 'Body Awareness'],
            objectives: ['Learn mindfulness fundamentals', 'Practice basic meditation', 'Develop body awareness'],
            requirements: ['Quiet space for practice', 'Comfortable seating'],
            curriculum: ['What is Mindfulness', 'Breathing Exercises', 'Body Scan Meditation', 'Mindful Walking'],
            reviews: [{
                    studentName: 'David Kim',
                    avatar: 'https://example.com/avatar6.jpg',
                    rating: 4,
                    comment: 'Perfect for beginners. Easy to follow.',
                    verified: true,
                    date: new Date('2024-03-05')
                },
                {
                    studentName: 'Rachel Green',
                    avatar: 'https://example.com/avatar7.jpg',
                    rating: 5,
                    comment: 'My kids love the meditation sessions!',
                    verified: true,
                    date: new Date('2024-03-20')
                },
                {
                    studentName: 'Tom Wilson',
                    avatar: 'https://example.com/avatar8.jpg',
                    rating: 4,
                    comment: 'Great content, audio quality could be better.',
                    verified: false,
                    date: new Date('2024-04-01')
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
            price: 499.99,
            originalPrice: 699.99,
            rating: 4.8,
            students: 450,
            category: 'Therapy',
            ageRange: 'adults',
            topics: ['Workplace Stress', 'Team Mental Health', 'Leadership Wellness'],
            objectives: ['Understand workplace mental health', 'Learn stress management', 'Develop wellness programs'],
            requirements: ['Management position or HR role', 'Company approval'],
            curriculum: ['Workplace Mental Health Overview', 'Stress Management', 'Building Support Systems', 'Program Implementation'],
            reviews: [{
                    studentName: 'Jennifer Corporate',
                    avatar: 'https://example.com/avatar9.jpg',
                    rating: 5,
                    comment: 'Transformed our company culture!',
                    verified: true,
                    date: new Date('2024-02-10')
                },
                {
                    studentName: 'Mark Executive',
                    avatar: 'https://example.com/avatar10.jpg',
                    rating: 5,
                    comment: 'Excellent ROI on mental health investment.',
                    verified: true,
                    date: new Date('2024-03-15')
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
            price: 89.99,
            originalPrice: 119.99,
            rating: 4.6,
            students: 675,
            category: 'Mental Health',
            ageRange: 'teenagers',
            topics: ['Teen Mental Health', 'Peer Pressure', 'Building Resilience', 'Communication Skills'],
            objectives: ['Understand teenage mental health issues', 'Learn coping strategies', 'Develop healthy communication skills'],
            requirements: ['Age 13-19', 'Parent/guardian consent'],
            curriculum: ['Understanding Teen Emotions', 'Dealing with Peer Pressure', 'Building Self-Esteem', 'Seeking Support'],
            reviews: [{
                    studentName: 'Teen Learner',
                    avatar: 'https://example.com/avatar11.jpg',
                    rating: 5,
                    comment: 'This course really helped me understand my feelings better.',
                    verified: true,
                    date: new Date('2024-04-15')
                },
                {
                    studentName: 'Parent Supporter',
                    avatar: 'https://example.com/avatar12.jpg',
                    rating: 4,
                    comment: 'Great resource for teens. Wish it was available when I was younger.',
                    verified: false,
                    date: new Date('2024-05-01')
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
            price: 69.99,
            originalPrice: 89.99,
            rating: 4.4,
            students: 1200,
            category: 'Wellness',
            ageRange: 'children',
            topics: ['Emotional Awareness', 'Feeling Identification', 'Expression Skills', 'Empathy Building'],
            objectives: ['Help children identify emotions', 'Teach healthy expression methods', 'Build empathy and understanding'],
            requirements: ['Age 6-12', 'Parent participation encouraged'],
            curriculum: ['What are Emotions', 'Identifying Feelings', 'Expressing Emotions', 'Understanding Others'],
            reviews: [{
                    studentName: 'Parent Educator',
                    avatar: 'https://example.com/avatar13.jpg',
                    rating: 5,
                    comment: 'My child loves this program! So engaging and educational.',
                    verified: true,
                    date: new Date('2024-03-25')
                },
                {
                    studentName: 'Teacher User',
                    avatar: 'https://example.com/avatar14.jpg',
                    rating: 4,
                    comment: 'Perfect for classroom use. Children learn so much.',
                    verified: true,
                    date: new Date('2024-04-10')
                }
            ],
            courseDuration: '4 weeks',
            courseType: 'individual',
            features: ['Animated Videos', 'Interactive Games', 'Parent Guides', 'Progress Certificates'],
            totalHours: 8,
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
}

module.exports = {
    seedCourses
};