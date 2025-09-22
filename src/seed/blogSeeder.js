// src/seed/blogSeeder.js
const Blog = require('../models/Blog');
const User = require('../models/User');

async function seedBlogs() {
    // Get users who can be authors (instructors, teachers, admins)
    const authors = await User.find({
        $or: [{
                roles: 'instructor'
            },
            {
                roles: 'teacher'
            },
            {
                roles: 'admin'
            }
        ]
    });

    if (authors.length === 0) {
        console.log('Warning: No potential authors found. Seed users first.');
        return;
    }

    const blogs = [
        // {
        //     title: '10 Signs You Might Need Mental Health Support',
        //     slug: '10-signs-mental-health-support',
        //     coverImage: 'https://example.com/images/mental-health-signs.jpg',
        //     content: 'Mental health is just as important as physical health. Here are 10 key signs that indicate you might benefit from professional mental health support...',
        //     tags: ['mental health', 'awareness', 'support'],
        //     isPublished: true,
        //     views: 150
        // },
        {
            title: 'Understanding Anxiety: Types, Symptoms, and Coping Strategies',
            slug: 'understanding-anxiety-types-symptoms-coping',
            coverImage: 'https://example.com/images/anxiety-understanding.jpg',
            content: 'Anxiety is one of the most common mental health conditions affecting millions worldwide. In this comprehensive guide, we explore the different types of anxiety disorders...',
            tags: ['anxiety', 'coping strategies', 'mental health'],
            isPublished: true,
            views: 89
        },
        {
            title: 'The Science Behind Mindfulness and Mental Wellbeing',
            slug: 'science-mindfulness-mental-wellbeing',
            coverImage: 'https://example.com/images/mindfulness-science.jpg',
            content: 'Research has consistently shown that mindfulness practices can significantly improve mental health outcomes. This article explores the scientific evidence...',
            tags: ['mindfulness', 'research', 'wellbeing'],
            isPublished: true,
            views: 234
        },
        {
            title: 'Building Resilience: Strategies for Overcoming Life Challenges',
            slug: 'building-resilience-strategies-challenges',
            coverImage: 'https://example.com/images/resilience-building.jpg',
            content: 'Resilience is our ability to bounce back from adversity, adapt to challenge, and grow from difficult experiences...',
            tags: ['resilience', 'personal growth', 'mental strength'],
            isPublished: false,
            views: 0
        }
    ];

    for (let i = 0; i < blogs.length; i++) {
        const blogData = blogs[i];
        const author = authors[i % authors.length]; // Cycle through authors

        const exists = await Blog.findOne({
            slug: blogData.slug
        });
        if (!exists) {
            blogData.authorId = author._id;
            blogData.comments = [];
            await Blog.create(blogData);
            console.log(`Created blog: ${blogData.title} by ${author.name}`);
        } else {
            console.log(`Blog exists: ${blogData.title}`);
        }
    }
}

module.exports = {
    seedBlogs
};