// src/seed/organizationSeeder.js
const Organization = require('../models/Organization');
const User = require('../models/User');

async function seedOrganizations() {
    // Get users with organization role
    const orgUsers = await User.find({
        roles: 'organization'
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