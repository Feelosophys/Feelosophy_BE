// src/seed/videoSeeder.js
const Video = require('../models/Video');
const Lesson = require('../models/Lesson');

async function seedVideos() {
    // Get existing lessons
    const lessons = await Lesson.find({}).populate('course');

    if (lessons.length === 0) {
        console.log('Warning: No lessons found. Seed lessons first.');
        return;
    }

    const videosData = [{
            title: 'Mental Health Overview',
            url: 'https://example.com/video1.mp4',
            duration: 900 // 15 minutes in seconds
        },
        {
            title: 'Common Mental Health Myths',
            url: 'https://example.com/video2.mp4',
            duration: 720 // 12 minutes
        },
        {
            title: 'Identifying Anxiety Triggers',
            url: 'https://example.com/video3.mp4',
            duration: 1080 // 18 minutes
        },
        {
            title: 'Box Breathing Technique',
            url: 'https://example.com/video4.mp4',
            duration: 600 // 10 minutes
        },
        {
            title: 'Mindful Awareness Exercise',
            url: 'https://example.com/video5.mp4',
            duration: 840 // 14 minutes
        },
        {
            title: '5-Minute Guided Meditation',
            url: 'https://example.com/video6.mp4',
            duration: 300 // 5 minutes
        },
        {
            title: 'Understanding Depression',
            url: 'https://example.com/video7.mp4',
            duration: 960 // 16 minutes
        },
        {
            title: 'Cognitive Behavioral Therapy Basics',
            url: 'https://example.com/video8.mp4',
            duration: 1200 // 20 minutes
        },
        {
            title: 'Building Emotional Strength',
            url: 'https://example.com/video9.mp4',
            duration: 780 // 13 minutes
        },
        {
            title: 'Stress Reduction Techniques',
            url: 'https://example.com/video10.mp4',
            duration: 660 // 11 minutes
        },
        {
            title: 'Sleep and Mental Wellness',
            url: 'https://example.com/video11.mp4',
            duration: 900 // 15 minutes
        },
        {
            title: 'Brain-Healthy Nutrition',
            url: 'https://example.com/video12.mp4',
            duration: 1020 // 17 minutes
        },
        {
            title: 'Digital Wellness Strategies',
            url: 'https://example.com/video13.mp4',
            duration: 720 // 12 minutes
        },
        {
            title: 'Managing Workplace Stress',
            url: 'https://example.com/video14.mp4',
            duration: 840 // 14 minutes
        },
        {
            title: 'Effective Family Communication',
            url: 'https://example.com/video15.mp4',
            duration: 960 // 16 minutes
        },
        {
            title: 'Trauma Recovery Process',
            url: 'https://example.com/video16.mp4',
            duration: 1140 // 19 minutes
        },
        {
            title: 'Addiction Recovery Journey',
            url: 'https://example.com/video17.mp4',
            duration: 1080 // 18 minutes
        },
        {
            title: 'LGBTQ+ Mental Health Support',
            url: 'https://example.com/video18.mp4',
            duration: 900 // 15 minutes
        },
        {
            title: 'Mental Health in Aging',
            url: 'https://example.com/video19.mp4',
            duration: 780 // 13 minutes
        },
        {
            title: 'Supporting Young Minds',
            url: 'https://example.com/video20.mp4',
            duration: 660 // 11 minutes
        }
    ];

    for (let i = 0; i < Math.min(lessons.length, videosData.length); i++) {
        const lesson = lessons[i];
        const videoData = videosData[i];

        const exists = await Video.findOne({
            lessonId: lesson._id,
            title: videoData.title
        });

        if (!exists) {
            videoData.lessonId = lesson._id;
            const createdVideo = await Video.create(videoData);

            // Update lesson with video reference
            await Lesson.findByIdAndUpdate(
                lesson._id, {
                    $push: {
                        videos: createdVideo._id
                    }
                }
            );

            console.log(`Created video: ${videoData.title} for lesson: ${lesson.title}`);
        } else {
            console.log(`Video exists: ${videoData.title}`);
        }
    }
}

module.exports = {
    seedVideos
};