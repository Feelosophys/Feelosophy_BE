// src/seed/courseSeeder.js
const Course = require('../models/Course');
const User = require('../models/User');

async function seedCourses() {
    // Get instructors
    const instructors = await User.find({
        roles: 'instructor'
    });

    if (instructors.length === 0) {
        console.log('Warning: No instructors found. Seed users first.');
        return;
    }

    const courses = [{
            title: 'Introduction to Mental Health',
            description: 'A comprehensive guide to understanding mental health basics',
            price: 99.99,
            category: 'Mental Health Basics',
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Managing Anxiety in Daily Life',
            description: 'Practical techniques for dealing with anxiety disorders',
            price: 149.99,
            category: 'Anxiety Management',
            isPublished: true,
            lessons: [],
            enrolledUsers: []
        },
        {
            title: 'Mindfulness and Meditation Fundamentals',
            description: 'Learn the basics of mindfulness practice and meditation',
            price: 79.99,
            category: 'Mindfulness & Meditation',
            isPublished: false,
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