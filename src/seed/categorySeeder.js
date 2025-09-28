// src/seed/categorySeeder.js
const Category = require('../models/Category');

async function seedCategories() {
    const categories = [{
            name: 'Mental Health Basics',
            description: 'Introduction to mental health concepts and awareness'
        },
        {
            name: 'Anxiety Management',
            description: 'Techniques and strategies for managing anxiety disorders'
        },
        {
            name: 'Depression Support',
            description: 'Resources and support for dealing with depression'
        },
        {
            name: 'Stress Management',
            description: 'Methods to cope with and reduce stress'
        },
        {
            name: 'Mindfulness & Meditation',
            description: 'Practices for mindful living and meditation techniques'
        },
        {
            name: 'Sleep & Wellness',
            description: 'Sleep hygiene and its impact on mental health'
        },
        {
            name: 'Workplace Mental Health',
            description: 'Mental health support in professional environments'
        },
        {
            name: 'Family & Relationships',
            description: 'Mental health in family dynamics and relationships'
        },
        {
            name: 'Nutrition & Mental Health',
            description: 'The connection between diet and mental wellbeing'
        },
        {
            name: 'Digital Wellness',
            description: 'Managing technology use for better mental health'
        },
        {
            name: 'Trauma Recovery',
            description: 'Healing from traumatic experiences'
        },
        {
            name: 'Addiction Support',
            description: 'Resources for overcoming substance abuse and addiction'
        },
        {
            name: 'LGBTQ+ Mental Health',
            description: 'Mental health support for LGBTQ+ communities'
        },
        {
            name: 'Senior Mental Health',
            description: 'Mental health considerations for older adults'
        },
        {
            name: 'Children & Teens',
            description: 'Mental health support for young people'
        }
    ];

    for (const category of categories) {
        const exists = await Category.findOne({
            name: category.name
        });
        if (!exists) {
            await Category.create(category);
            console.log(`Created category: ${category.name}`);
        } else {
            console.log(`Category exists: ${category.name}`);
        }
    }
}

module.exports = {
    seedCategories
};