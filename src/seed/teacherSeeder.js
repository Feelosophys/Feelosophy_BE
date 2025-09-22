// src/seed/teacherSeeder.js
const Teacher = require('../models/Teacher');
const User = require('../models/User');

async function seedTeachers() {
    // Tìm user có role 'teacher'
    const teachers = await User.find({
        roles: 'teacher'
    });

    for (const user of teachers) {
        const exists = await Teacher.findOne({
            user: user._id
        });
        if (!exists) {
            const teacherData = {
                user: user._id,
                bio: `Experienced mental health professional specializing in ${user.name === 'Dr. Michael Brown' ? 'consultation and therapy' : 'counseling and education'}`,
                expertise: user.name === 'Dr. Michael Brown' ? ['Mental Health Consultation', 'Therapy Sessions', 'Stress Management'] : ['Counseling', 'Mental Health Education', 'Group Therapy']
            };
            await Teacher.create(teacherData);
            console.log(`Created teacher profile for: ${user.email}`);
        } else {
            console.log(`Teacher profile exists for: ${user.email}`);
        }
    }
}

module.exports = {
    seedTeachers
};