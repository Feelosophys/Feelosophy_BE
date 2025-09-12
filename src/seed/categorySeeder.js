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