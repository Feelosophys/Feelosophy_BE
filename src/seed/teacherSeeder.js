// src/seed/teacherSeeder.js
const Teacher = require('../models/Teacher');
const User = require('../models/User');

async function seedTeachers() {
    // Tìm user có role 'teacher' hoặc roles chứa 'teacher'
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

    for (const user of teachers) {
        const exists = await Teacher.findOne({
            user: user._id
        });
        if (!exists) {
            let teacherData;

            if (user.name === 'Dr. Sarah Johnson') {
                teacherData = {
                    user: user._id,
                    specialization: ['Clinical Psychology', 'Cognitive Behavioral Therapy', 'Mindfulness'],
                    experience: '10+ years of experience in clinical psychology and therapy',
                    rating: 4.8,
                    reviews: 156,
                    price: 150,
                    bio: 'Licensed clinical psychologist with extensive experience in cognitive behavioral therapy, mindfulness-based interventions, and anxiety disorder treatment.',
                    availability: ['Monday 9AM-5PM', 'Wednesday 9AM-5PM', 'Friday 9AM-3PM']
                };
            } else if (user.name === 'Dr. Michael Brown') {
                teacherData = {
                    user: user._id,
                    specialization: ['Organizational Psychology', 'Workplace Wellness', 'Stress Management'],
                    experience: '8+ years in corporate mental health and organizational psychology',
                    rating: 4.6,
                    reviews: 89,
                    price: 120,
                    bio: 'Experienced consultant specializing in workplace mental health, organizational psychology, and corporate wellness programs.',
                    availability: ['Tuesday 10AM-6PM', 'Thursday 10AM-6PM', 'Saturday 9AM-1PM']
                };
            } else if (user.name === 'Dr. Emily Davis') {
                teacherData = {
                    user: user._id,
                    specialization: ['Clinical Counseling', 'Depression Treatment', 'Anxiety Disorders'],
                    experience: '12+ years in clinical counseling and mental health treatment',
                    rating: 4.9,
                    reviews: 203,
                    price: 130,
                    bio: 'Clinical counselor with specialized expertise in depression treatment, anxiety disorders, and evidence-based therapeutic interventions.',
                    availability: ['Monday 8AM-4PM', 'Tuesday 8AM-4PM', 'Thursday 8AM-4PM', 'Friday 8AM-4PM']
                };
            } else if (user.name === 'Dr. Lisa Anderson') {
                teacherData = {
                    user: user._id,
                    specialization: ['Trauma Therapy', 'PTSD Treatment', 'EMDR Therapy', 'Trauma Recovery'],
                    experience: '15+ years specializing in trauma-informed care and PTSD treatment',
                    rating: 4.7,
                    reviews: 178,
                    price: 160,
                    bio: 'Certified trauma specialist with extensive experience in EMDR therapy, trauma recovery programs, and supporting survivors of complex trauma.',
                    availability: ['Monday 10AM-6PM', 'Wednesday 10AM-6PM', 'Friday 10AM-4PM', 'Saturday 9AM-2PM']
                };
            } else if (user.name === 'Dr. Robert Martinez') {
                teacherData = {
                    user: user._id,
                    specialization: ['Family Therapy', 'Couples Counseling', 'Relationship Counseling', 'Family Dynamics'],
                    experience: '10+ years in family therapy and relationship counseling',
                    rating: 4.8,
                    reviews: 145,
                    price: 140,
                    bio: 'Experienced family therapist helping couples and families navigate relationship challenges, communication issues, and family conflicts.',
                    availability: ['Tuesday 9AM-5PM', 'Wednesday 9AM-5PM', 'Thursday 9AM-5PM', 'Saturday 10AM-3PM']
                };
            } else {
                // Default teacher data
                teacherData = {
                    user: user._id,
                    specialization: ['Mental Health Counseling', 'Therapy'],
                    experience: '5+ years in mental health counseling',
                    rating: 4.5,
                    reviews: 45,
                    price: 100,
                    bio: 'Experienced mental health professional providing counseling and therapeutic services.',
                    availability: ['Monday-Friday 9AM-5PM']
                };
            }

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