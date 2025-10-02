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
            url: 'https://www.youtube.com/watch?v=oxx564hMBUI',
            duration: 346
        },
        {
            title: 'Common Mental Health Myths',
            url: 'https://www.youtube.com/watch?v=O6WGVe6Aebk',
            duration: 667
        },
        {
            title: 'Identifying Anxiety Triggers',
            url: 'https://www.youtube.com/watch?v=ia61O6vfyEU',
            duration: 230
        },
        {
            title: 'Box Breathing Technique',
            url: 'https://www.youtube.com/watch?v=FJJazKtH_9I',
            duration: 376
        },
        {
            title: 'Mindful Awareness Exercise',
            url: 'https://www.youtube.com/watch?v=bLpChrgS0AY',
            duration: 224
        },
        {
            title: '5-Minute Guided Meditation',
            url: 'https://www.youtube.com/watch?v=j734gLbQFbU',
            duration: 332
        },
        {
            title: 'Understanding Depression',
            url: 'https://www.youtube.com/watch?v=z-IR48Mb3W0',
            duration: 269
        },
        {
            title: 'Cognitive Behavioral Therapy Basics',
            url: 'https://www.youtube.com/watch?v=ZdyOwZ4_RnI',
            duration: 295
        },
        {
            title: 'Building Emotional Strength',
            url: 'https://www.youtube.com/watch?v=rxDjTyWRqDA',
            duration: 287
        },
        {
            title: 'Stress Reduction Techniques',
            url: 'https://www.youtube.com/watch?v=HB1snh5ArVw',
            duration: 715
        },
        {
            title: 'Sleep and Mental Wellness',
            url: 'https://www.youtube.com/watch?v=236eHGCSPvI',
            duration: 355
        },
        {
            title: 'Brain-Healthy Nutrition',
            url: 'https://www.youtube.com/watch?v=xNXxBlytth8',
            duration: 255
        },
        {
            title: 'Digital Wellness Strategies',
            url: 'https://www.youtube.com/watch?v=jYzNRu76F8I',
            duration: 247
        },
        {
            title: 'Managing Workplace Stress',
            url: 'https://www.youtube.com/watch?v=QE8kNh52EeU',
            duration: 639
        },
        {
            title: 'Effective Family Communication',
            url: 'https://www.youtube.com/watch?v=ImAlo7urjRQ',
            duration: 262
        },
        {
            title: 'Trauma Recovery Process',
            url: 'https://www.youtube.com/watch?v=qrPb0nutBrg',
            duration: 375
        },
        {
            title: 'Addiction Recovery Journey',
            url: 'https://www.youtube.com/watch?v=yAHn1kSo9l8',
            duration: 649
        },
        {
            title: 'LGBTQ+ Mental Health Support',
            url: 'https://www.youtube.com/watch?v=Rfhgs9QclEM',
            duration: 265
        },
        {
            title: 'Mental Health in Aging',
            url: 'https://www.youtube.com/watch?v=C2dum954yIg',
            duration: 326
        },
        {
            title: 'Supporting Young Minds',
            url: 'https://www.youtube.com/watch?v=dPB8oQBD1qE',
            duration: 64
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