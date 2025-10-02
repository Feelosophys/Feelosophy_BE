// src/seed/blogSeeder.js
const Blog = require('../models/Blog');
const User = require('../models/User');

async function seedBlogs() {
    // Get users who can be authors (instructors, teachers, admins)
    const authors = await User.find({
        $or: [{
                role: 'teacher'
            },
            {
                role: 'admin'
            }
        ]
    });

    if (authors.length === 0) {
        console.log('Warning: No potential authors found. Seed users first.');
        return;
    }

    const blogs = [{
            title: 'Understanding Anxiety: Types, Symptoms, and Coping Strategies',
            slug: 'understanding-anxiety-types-symptoms-coping',
            coverImage: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Funitymedicalcentre.ca%2Funderstanding-anxiety-symptoms-causes-and-coping-strategies%2F&psig=AOvVaw0WKjqQBix-CyTpN4Ck7E4o&ust=1759503786817000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCJCMrLjkhZADFQAAAAAdAAAAABAE',
            content: 'Anxiety is one of the most common mental health conditions affecting millions worldwide. In this comprehensive guide, we explore the different types of anxiety disorders...',
            tags: ['anxiety', 'coping strategies', 'mental health'],
            isPublished: true,
            views: 89
        },
        {
            title: 'The Science Behind Mindfulness and Mental Wellbeing',
            slug: 'science-mindfulness-mental-wellbeing',
            coverImage: 'https://publichealth.jhu.edu/sites/default/files/styles/social_image/public/2021-12/mental-health-well-being-gettyimages-1185654371.jpeg?itok=elh5QmEK',
            content: 'Research has consistently shown that mindfulness practices can significantly improve mental health outcomes. This article explores the scientific evidence...',
            tags: ['mindfulness', 'research', 'wellbeing'],
            isPublished: true,
            views: 234
        },
        {
            title: 'Building Resilience: Strategies for Overcoming Life Challenges',
            slug: 'building-resilience-strategies-challenges',
            coverImage: 'https://media.licdn.com/dms/image/v2/D5612AQH9uV7r6Ku7MA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1685540024013?e=2147483647&v=beta&t=TUaFa9tFm6NXiBPfxi0l14iJz-Ov2912fx32Ic62xR0',
            content: 'Resilience is our ability to bounce back from adversity, adapt to challenge, and grow from difficult experiences...',
            tags: ['resilience', 'personal growth', 'mental strength'],
            isPublished: false,
            views: 0
        },
        {
            title: '10 Signs You Might Need Mental Health Support',
            slug: '10-signs-mental-health-support',
            coverImage: 'https://devainstitute.com/wp-content/uploads/2025/01/Mental-Health-Support.jpg',
            content: 'Mental health is just as important as physical health. Here are 10 key signs that indicate you might benefit from professional mental health support...',
            tags: ['mental health', 'awareness', 'support'],
            isPublished: true,
            views: 150
        },
        {
            title: 'Depression: Breaking the Stigma and Finding Hope',
            slug: 'depression-breaking-stigma-finding-hope',
            coverImage: 'https://madeyousmileback.com/wp-content/uploads/2024/01/Mental-Health-Awareness-Breaking-the-Stigma-MYSB.webp',
            content: 'Depression affects millions of people worldwide, yet stigma often prevents individuals from seeking help. This article explores the realities of depression...',
            tags: ['depression', 'stigma', 'hope', 'mental health'],
            isPublished: true,
            views: 312
        },
        {
            title: 'Sleep and Mental Health: The Critical Connection',
            slug: 'sleep-mental-health-critical-connection',
            coverImage: 'https://horizons-cdn.hostinger.com/eea4ef26-68ad-4260-8c86-38ca55a1c43d/61dbad800e4ab71102831ccc8547203c.png',
            content: 'Quality sleep is essential for mental health and wellbeing. Poor sleep can exacerbate mental health conditions and vice versa...',
            tags: ['sleep', 'mental health', 'wellness', 'rest'],
            isPublished: true,
            views: 198
        },
        {
            title: 'Workplace Mental Health: Creating Supportive Environments',
            slug: 'workplace-mental-health-supportive-environments',
            coverImage: 'https://media.licdn.com/dms/image/v2/D4E12AQGu9W_yfYVc8Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1728548309403?e=2147483647&v=beta&t=WgeLGzOfw31gZFpRznFdYrBAZNZhBs6N0CyqBjQ80qI',
            content: 'Creating mentally healthy workplaces benefits both employees and organizations. Learn about strategies for supporting mental health at work...',
            tags: ['workplace', 'mental health', 'corporate wellness', 'support'],
            isPublished: true,
            views: 267
        },
        {
            title: 'Parenting Through Mental Health Challenges',
            slug: 'parenting-mental-health-challenges',
            coverImage: 'https://therapy-central.com/wp-content/uploads/2022/09/how-to-cope-with-a-parent-with-mental-health-issues-1024x1024.png',
            content: 'Parenting while managing mental health challenges can be difficult, but support is available. This guide offers practical advice and resources...',
            tags: ['parenting', 'mental health', 'family', 'support'],
            isPublished: true,
            views: 189
        },
        {
            title: 'The Role of Nutrition in Mental Health',
            slug: 'nutrition-mental-health-role',
            coverImage: 'https://transformwithnatasha.com/wp-content/uploads/2025/02/CCMH-NutritionandMentalHealth.png',
            content: 'Diet and nutrition play a significant role in mental health. Certain foods and nutrients can support brain function and mood regulation...',
            tags: ['nutrition', 'mental health', 'diet', 'wellness'],
            isPublished: false,
            views: 0
        },
        {
            title: 'Digital Detox: Managing Screen Time for Better Mental Health',
            slug: 'digital-detox-screen-time-mental-health',
            coverImage: 'https://medsourcelabs.com/wp-content/uploads/2024/06/Digital-Detox-blog-banner1.webp',
            content: 'Excessive screen time can negatively impact mental health. Learn about digital detox strategies and creating healthier technology habits...',
            tags: ['digital detox', 'screen time', 'mental health', 'technology'],
            isPublished: true,
            views: 145
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