// src/seed/organizationSeeder.js
const Organization = require('../models/Organization');
const User = require('../models/User');

async function seedOrganizations() {
    // Get users with organization role
    const orgUsers = await User.find({
        role: 'admin'
    });

    if (orgUsers.length === 0) {
        console.log('Warning: No organization users found. Seed users first.');
        return;
    }

    const organizations = [{
            name: 'Wellness Corp',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Mental Health Alliance',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Corporate Wellness Solutions',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Healthcare Partners Inc',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'MindCare Group',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Wellbeing Enterprises',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Mental Wellness Institute',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Corporate Health Partners',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Employee Wellness Network',
            members: [],
            purchasedCourses: []
        },
        {
            name: 'Healthcare Solutions LLC',
            members: [],
            purchasedCourses: []
        }
    ];

    for (let i = 0; i < Math.min(orgUsers.length, organizations.length); i++) {
        const orgUser = orgUsers[i];
        const orgData = organizations[i];

        const exists = await Organization.findOne({
            owner: orgUser._id
        });
        if (!exists) {
            orgData.owner = orgUser._id;
            await Organization.create(orgData);
            console.log(`Created organization: ${orgData.name}`);
        } else {
            console.log(`Organization exists for owner: ${orgUser.email}`);
        }
    }
}

module.exports = {
    seedOrganizations
};