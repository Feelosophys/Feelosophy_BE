// src/seed/index.js
// Main seeder file that runs all seeders in proper order
require('dotenv').config();
const {
    connectDB
} = require('../config/db');
const {
    seedRoles
} = require('./roleSeeder');
const {
    seedCategories
} = require('./categorySeeder');
const {
    seedUsers
} = require('./userSeeder');
const {
    seedWallets
} = require('./walletSeeder');
const {
    seedOrganizations
} = require('./organizationSeeder');
const {
    seedCourses
} = require('./courseSeeder');
const {
    seedLessons
} = require('./lessonSeeder');
const {
    seedVideos
} = require('./videoSeeder');
const {
    seedDocuments
} = require('./documentSeeder');
const {
    seedWorkingHours
} = require('./workingHourSeeder');
const {
    seedBlogs
} = require('./blogSeeder');
const seedForum = require('./forumSeeder');

async function runAllSeeders() {
    try {
        console.log('🌱 Starting database seeding...');

        // Connect to database
        await connectDB();
        console.log('✅ Connected to MongoDB');

        // Run seeders in dependency order
        console.log('\n� Seeding Roles...');
        await seedRoles();

        console.log('\n�📝 Seeding Categories...');
        await seedCategories();

        console.log('\n👥 Seeding Users...');
        await seedUsers();

        console.log('\n💰 Seeding Wallets...');
        await seedWallets();

        console.log('\n🏢 Seeding Organizations...');
        await seedOrganizations();

        console.log('\n📚 Seeding Courses...');
        await seedCourses();

        console.log('\n📖 Seeding Lessons...');
        await seedLessons();

        console.log('\n🎥 Seeding Videos...');
        await seedVideos();

        console.log('\n📄 Seeding Documents...');
        await seedDocuments();

        console.log('\n⏰ Seeding Working Hours...');
        await seedWorkingHours();

        console.log('\n📰 Seeding Blogs...');
        await seedBlogs();

        console.log('\n💬 Seeding Forum...');
        await seedForum();

        console.log('\n✅ Database seeding completed successfully!');
        console.log('🎉 You can now start your application');

    } catch (error) {
        console.error('❌ Error during seeding:', error);
        process.exit(1);
    } finally {
        // Exit the process
        process.exit(0);
    }
}

// Run if this file is executed directly
if (require.main === module) {
    runAllSeeders();
}

module.exports = {
    runAllSeeders
};