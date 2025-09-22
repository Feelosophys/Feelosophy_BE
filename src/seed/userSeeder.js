// src/seed/userSeeder.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedUsers() {
    const users = [{
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            roles: ['admin'],
            bio: 'Platform administrator'
        },
        {
            name: 'John Smith',
            email: 'john.smith@example.com',
            password: 'user123',
            roles: ['user'],
            bio: 'Mental health enthusiast and learner'
        },
        {
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            password: 'instructor123',
            roles: ['instructor'],
            bio: 'Licensed therapist and course instructor'
        },
        {
            name: 'Dr. Michael Brown',
            email: 'michael.brown@example.com',
            password: 'teacher123',
            roles: ['teacher'],
            bio: 'Mental health consultation teacher'
        },
        {
            name: 'Dr. Emily Davis',
            email: 'emily.davis@example.com',
            password: 'teacher456',
            roles: ['teacher'],
            bio: 'Experienced mental health teacher and counselor'
        },
        {
            name: 'Wellness Corp',
            email: 'org@wellnesscorp.com',
            password: 'org123',
            roles: ['organization'],
            bio: 'Corporate wellness organization'
        }
    ];

    for (const user of users) {
        const exists = await User.findOne({
            email: user.email
        });
        if (!exists) {
            user.password = await bcrypt.hash(user.password, 10);
            await User.create(user);
            console.log(`Created user: ${user.email}`);
        } else {
            console.log(`User exists: ${user.email}`);
        }
    }
}

module.exports = {
    seedUsers
};