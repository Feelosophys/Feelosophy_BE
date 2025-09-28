// src/seed/workingHourSeeder.js
const WorkingHour = require('../models/WorkingHour');
const User = require('../models/User');

async function seedWorkingHours() {
    // Get teachers
    const teachers = await User.find({
        $or: [{
                role: 'teacher'
            },
            {
                roles: {
                    $in: ['teacher']
                }
            }
        ]
    });

    if (teachers.length === 0) {
        console.log('Warning: No teachers found. Seed users first.');
        return;
    }

    // Create working hours for the next 7 days
    const workingHours = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Skip weekends
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        // Morning slots
        workingHours.push({
            date: date,
            startTime: '09:00',
            endTime: '10:00',
            isBooked: false
        });

        workingHours.push({
            date: date,
            startTime: '10:00',
            endTime: '11:00',
            isBooked: false
        });

        workingHours.push({
            date: date,
            startTime: '11:00',
            endTime: '12:00',
            isBooked: false
        });

        // Afternoon slots
        workingHours.push({
            date: date,
            startTime: '14:00',
            endTime: '15:00',
            isBooked: false
        });

        workingHours.push({
            date: date,
            startTime: '15:00',
            endTime: '16:00',
            isBooked: false
        });

        workingHours.push({
            date: date,
            startTime: '16:00',
            endTime: '17:00',
            isBooked: false
        });

        // Evening slots
        workingHours.push({
            date: date,
            startTime: '18:00',
            endTime: '19:00',
            isBooked: false
        });

        workingHours.push({
            date: date,
            startTime: '19:00',
            endTime: '20:00',
            isBooked: false
        });
    }

    for (const teacher of teachers) {
        for (const workingHour of workingHours) {
            const exists = await WorkingHour.findOne({
                teacherId: teacher._id,
                date: workingHour.date,
                startTime: workingHour.startTime
            });

            if (!exists) {
                workingHour.teacherId = teacher._id;
                await WorkingHour.create({
                    ...workingHour
                });
                console.log(`Created working hour for ${teacher.name} on ${workingHour.date.toDateString()} ${workingHour.startTime}-${workingHour.endTime}`);
            } else {
                console.log(`Working hour exists for ${teacher.name} on ${workingHour.date.toDateString()} ${workingHour.startTime}`);
            }
        }
    }
}

module.exports = {
    seedWorkingHours
};