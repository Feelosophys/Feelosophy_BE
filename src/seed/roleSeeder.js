// src/seed/roleSeeder.js
const Role = require('../models/Role');

async function seedRoles() {
    const roles = [{
            name: 'admin',
            description: 'System administrator with full access'
        },
        {
            name: 'user',
            description: 'Regular user who can enroll in courses'
        },
        {
            name: 'instructor',
            description: 'Course instructor who can create and manage courses'
        },
        {
            name: 'teacher',
            description: 'Mental health teacher for consultations'
        },
        {
            name: 'organization',
            description: 'Organization that can purchase courses for members'
        }
    ];

    for (const role of roles) {
        const exists = await Role.findOne({
            name: role.name
        });
        if (!exists) {
            await Role.create(role);
            console.log(`Created role: ${role.name}`);
        } else {
            console.log(`Role exists: ${role.name}`);
        }
    }
}

module.exports = {
    seedRoles
};