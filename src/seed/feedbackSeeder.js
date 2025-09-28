// src/seed/feedbackSeeder.js
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const User = require('../models/User');

async function seedFeedback() {
    // Get courses and users
    const courses = await Course.find({
        isPublished: true
    });
    const users = await User.find({
        role: 'user'
    });

    if (courses.length === 0 || users.length === 0) {
        console.log('Warning: No courses or users found. Seed courses and users first.');
        return;
    }

    const sampleReviews = [{
            courseIndex: 0,
            userIndex: 0,
            rating: 5,
            comment: 'Excellent course! Very comprehensive and well-structured. Learned a lot about mental health basics.',
            verified: true
        },
        {
            courseIndex: 0,
            userIndex: 1,
            rating: 4,
            comment: 'Great introduction to mental health. The content was informative and easy to understand.',
            verified: true
        },
        {
            courseIndex: 1,
            userIndex: 0,
            rating: 5,
            comment: 'This course helped me manage my anxiety much better. The techniques are practical and effective.',
            verified: true
        },
        {
            courseIndex: 1,
            userIndex: 1,
            rating: 4,
            comment: 'Very helpful strategies for dealing with anxiety. Would recommend to anyone struggling.',
            verified: false
        },
        {
            courseIndex: 2,
            userIndex: 0,
            rating: 5,
            comment: 'Mindfulness techniques changed my daily routine. Highly recommend this course!',
            verified: true
        },
        {
            courseIndex: 2,
            userIndex: 1,
            rating: 4,
            comment: 'Good foundation for mindfulness practice. The meditations are calming and helpful.',
            verified: true
        },
        {
            courseIndex: 3,
            userIndex: 0,
            rating: 5,
            comment: 'Perfect for our corporate wellness program. Comprehensive and professional.',
            verified: true
        }
    ];

    for (const reviewData of sampleReviews) {
        const course = courses[reviewData.courseIndex];
        const user = users[reviewData.userIndex];

        if (!course || !user) continue;

        const exists = await Feedback.findOne({
            userId: user._id,
            courseId: course._id
        });

        if (!exists) {
            const feedbackData = {
                userId: user._id,
                courseId: course._id,
                rating: reviewData.rating,
                comment: reviewData.comment,
                verified: reviewData.verified
            };

            await Feedback.create(feedbackData);
            console.log(`Created review for course: ${course.title} by ${user.name}`);
        } else {
            console.log(`Review exists for course: ${course.title} by ${user.name}`);
        }
    }
}

module.exports = {
    seedFeedback
};