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
        },
        {
            title: 'Depression: Signs and Symptoms',
            videos: [],
            documents: []
        },
        {
            title: 'Cognitive Behavioral Techniques',
            videos: [],
            documents: []
        },
        {
            title: 'Building Emotional Resilience',
            videos: [],
            documents: []
        },
        {
            title: 'Stress Management Strategies',
            videos: [],
            documents: []
        },
        {
            title: 'Sleep Hygiene and Mental Health',
            videos: [],
            documents: []
        },
        {
            title: 'Nutrition for Brain Health',
            videos: [],
            documents: []
        },
        {
            title: 'Digital Detox Practices',
            videos: [],
            documents: []
        },
        {
            title: 'Workplace Stress Management',
            videos: [],
            documents: []
        },
        {
            title: 'Family Communication Skills',
            videos: [],
            documents: []
        },
        {
            title: 'Trauma-Informed Care Basics',
            videos: [],
            documents: []
        },
        {
            title: 'Addiction Recovery Support',
            videos: [],
            documents: []
        },
        {
            title: 'LGBTQ+ Mental Health Awareness',
            videos: [],
            documents: []
        },
        {
            title: 'Senior Mental Health Considerations',
            videos: [],
            documents: []
        },
        {
            title: 'Supporting Children\'s Mental Health',
            videos: [],
            documents: []
        }
    ];

    let lessonIndex = 0;
    for (const course of courses) {
        const lessonsPerCourse = Math.min(4, Math.ceil(lessonsData.length / courses.length)); // 4 lessons per course max

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