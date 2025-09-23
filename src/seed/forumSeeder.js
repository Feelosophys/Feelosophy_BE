// src/seed/forumSeeder.js
const Forum = require('../models/Forum');
const User = require('../models/User');

const forumData = [{
        title: 'How to manage stress during exams?',
        content: 'I\'m a student and I always feel stressed during exam periods. Any tips on how to stay calm and focused?',
        tags: ['stress', 'exams', 'students'],
        status: 'open'
    },
    {
        title: 'Benefits of meditation for mental health',
        content: 'I\'ve been meditating for a few weeks now. Has anyone experienced positive changes in their mental health?',
        tags: ['meditation', 'mental-health', 'wellness'],
        status: 'open'
    },
    {
        title: 'Dealing with anxiety in social situations',
        content: 'I get really anxious when meeting new people. What techniques have worked for you?',
        tags: ['anxiety', 'social', 'tips'],
        status: 'open'
    }
];

async function seedForum() {
    try {
        // Get a sample user as author
        const user = await User.findOne();
        if (!user) {
            console.log('No users found, skipping forum seeding');
            return;
        }

        for (const data of forumData) {
            const forumPost = new Forum({
                ...data,
                authorId: user._id
            });
            await forumPost.save();
        }

        console.log('Forum posts seeded successfully');
    } catch (error) {
        console.error('Error seeding forum:', error);
    }
}

module.exports = seedForum;