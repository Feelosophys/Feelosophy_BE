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
    },
    {
        title: 'Sleep problems and mental health',
        content: 'I\'ve been having trouble sleeping lately and it\'s affecting my mood. Any recommendations for improving sleep quality?',
        tags: ['sleep', 'insomnia', 'mental-health'],
        status: 'open'
    },
    {
        title: 'Workplace burnout - how to recognize and prevent it',
        content: 'I feel constantly exhausted at work. How can I tell if it\'s burnout and what can I do about it?',
        tags: ['burnout', 'workplace', 'exhaustion'],
        status: 'open'
    },
    {
        title: 'Mindfulness apps - which ones do you recommend?',
        content: 'I\'m looking for good mindfulness and meditation apps. What are your favorites and why?',
        tags: ['mindfulness', 'apps', 'meditation'],
        status: 'open'
    },
    {
        title: 'Supporting a friend with depression',
        content: 'My friend has been diagnosed with depression. How can I best support them without overstepping?',
        tags: ['depression', 'support', 'friends'],
        status: 'open'
    },
    {
        title: 'Exercise and mental health benefits',
        content: 'How does regular exercise affect mental health? What types of exercise work best?',
        tags: ['exercise', 'mental-health', 'fitness'],
        status: 'open'
    },
    {
        title: 'Digital detox challenges and tips',
        content: 'I\'m trying to reduce my screen time but it\'s harder than I thought. Any tips for successful digital detox?',
        tags: ['digital-detox', 'screen-time', 'wellness'],
        status: 'open'
    },
    {
        title: 'Parenting with mental health challenges',
        content: 'How do you balance parenting responsibilities when dealing with your own mental health issues?',
        tags: ['parenting', 'mental-health', 'family'],
        status: 'open'
    },
    {
        title: 'Seasonal affective disorder (SAD)',
        content: 'As winter approaches, I notice my mood getting worse. Could this be SAD? What helps?',
        tags: ['SAD', 'seasonal', 'depression'],
        status: 'open'
    },
    {
        title: 'Building resilience after trauma',
        content: 'I\'m working on recovery after a traumatic experience. What strategies have helped you build resilience?',
        tags: ['trauma', 'resilience', 'recovery'],
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