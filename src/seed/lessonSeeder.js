// src/seed/lessonSeeder.js
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

async function seedLessons() {
    // Get existing courses
    const courses = await Course.find({});

    if (courses.length === 0) {
        console.log('Warning: No courses found. Seed courses first.');
        return;
    }

    const lessonsData = [{
            title: 'What is Mental Health?',
            videos: [],
            documents: []
        },
        {
            title: 'Understanding Mental Health Conditions',
            videos: [],
            documents: []
        },
        {
            title: 'Recognizing Anxiety Symptoms',
            videos: [],
            documents: []
        },
        {
            title: 'Breathing Techniques for Anxiety',
            videos: [],
            documents: []
        },
        {
            title: 'Introduction to Mindfulness',
            videos: [],
            documents: []
        },
        {
            title: 'Basic Meditation Practices',
            videos: [],
            documents: []
        }
    ];

    let lessonIndex = 0;
    for (const course of courses) {
        const lessonsPerCourse = 2; // 2 lessons per course

        for (let i = 0; i < lessonsPerCourse && lessonIndex < lessonsData.length; i++) {
            const lessonData = lessonsData[lessonIndex];

            const exists = await Lesson.findOne({
                course: course._id,
                title: lessonData.title
            });

            if (!exists) {
                lessonData.course = course._id;
                const createdLesson = await Lesson.create(lessonData);

                // Update course with lesson reference
                await Course.findByIdAndUpdate(
                    course._id, {
                        $push: {
                            lessons: createdLesson._id
                        }
                    }
                );

                console.log(`Created lesson: ${lessonData.title} for course: ${course.title}`);
            } else {
                console.log(`Lesson exists: ${lessonData.title}`);
            }

            lessonIndex++;
        }
    }
}

module.exports = {
    seedLessons
};