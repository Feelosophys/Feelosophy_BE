// src/seed/userSeeder.js
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function seedUsers() {
    const users = [{
            name: 'Admin',
            email: 'admin@example.com',
            password: 'admin123',
            role: 'admin',
            title: 'Platform Administrator',
            bio: 'Platform administrator responsible for system management and user support',
            phone: '+1-555-0100',
            location: 'New York, USA',
            website: 'https://mentalhealthplatform.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/admin',
                twitter: 'https://twitter.com/admin'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'John Smith',
            email: 'john.smith@example.com',
            password: 'user123',
            role: 'user',
            title: 'Mental Health Advocate',
            bio: 'Mental health enthusiast and learner passionate about wellness and self-improvement',
            phone: '+1-555-0101',
            location: 'Los Angeles, USA',
            socialLinks: {
                facebook: 'https://facebook.com/john.smith',
                instagram: 'https://instagram.com/john.smith'
            },
            isVerified: true,
            coursesEnrolled: 3,
            coursesCompleted: 2,
            totalSpent: 249.98,
            walletBalance: 50.00
        },
        {
            name: 'Dr. Sarah Johnson',
            email: 'sarah.johnson@example.com',
            password: 'instructor123',
            role: 'teacher',
            title: 'Licensed Clinical Psychologist',
            bio: 'Licensed therapist with 10+ years of experience in cognitive behavioral therapy and mindfulness-based interventions',
            phone: '+1-555-0102',
            location: 'Chicago, USA',
            website: 'https://drsarahjohnson.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/drsarahjohnson',
                twitter: 'https://twitter.com/dr_sarah_j'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Dr. Michael Brown',
            email: 'michael.brown@example.com',
            password: 'teacher123',
            role: 'teacher',
            title: 'Mental Health Consultant',
            bio: 'Experienced mental health consultant specializing in workplace wellness and organizational psychology',
            phone: '+1-555-0103',
            location: 'Boston, USA',
            website: 'https://drmichaelbrown.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/drmichaelbrown'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Dr. Emily Davis',
            email: 'emily.davis@example.com',
            password: 'teacher456',
            role: 'teacher',
            title: 'Clinical Counselor',
            bio: 'Experienced clinical counselor specializing in anxiety disorders and depression treatment',
            phone: '+1-555-0104',
            location: 'Seattle, USA',
            website: 'https://dremilydavis.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/dremilydavis',
                twitter: 'https://twitter.com/dr_emily_d'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Wellness Corp',
            email: 'org@wellnesscorp.com',
            password: 'org123',
            role: 'admin', // Organizations can be admins for corporate features
            title: 'Corporate Wellness Organization',
            bio: 'Leading corporate wellness organization providing mental health programs for businesses',
            phone: '+1-555-0105',
            location: 'San Francisco, USA',
            website: 'https://wellnesscorp.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/company/wellnesscorp'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Alice Wilson',
            email: 'alice.wilson@example.com',
            password: 'user456',
            role: 'user',
            title: 'Wellness Coach',
            bio: 'Certified wellness coach helping individuals achieve mental and physical wellbeing',
            phone: '+1-555-0106',
            location: 'Austin, USA',
            socialLinks: {
                instagram: 'https://instagram.com/alicewellness'
            },
            isVerified: true,
            coursesEnrolled: 5,
            coursesCompleted: 3,
            totalSpent: 399.97,
            walletBalance: 25.00
        },
        {
            name: 'Bob Chen',
            email: 'bob.chen@example.com',
            password: 'user789',
            role: 'user',
            title: 'Software Developer',
            bio: 'Tech professional interested in mental health and work-life balance',
            phone: '+1-555-0107',
            location: 'Seattle, USA',
            socialLinks: {
                github: 'https://github.com/bobchen',
                linkedin: 'https://linkedin.com/in/bobchen'
            },
            isVerified: false,
            coursesEnrolled: 2,
            coursesCompleted: 1,
            totalSpent: 149.99,
            walletBalance: 75.00
        },
        {
            name: 'Dr. Lisa Rodriguez',
            email: 'lisa.rodriguez@example.com',
            password: 'teacher789',
            role: 'teacher',
            title: 'Marriage and Family Therapist',
            bio: 'Licensed marriage and family therapist specializing in relationship counseling and family dynamics',
            phone: '+1-555-0108',
            location: 'Miami, USA',
            website: 'https://drlisarodriguez.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/drlisarodriguez'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Dr. James Wilson',
            email: 'james.wilson@example.com',
            password: 'teacher101',
            role: 'teacher',
            title: 'Psychiatrist',
            bio: 'Board-certified psychiatrist with expertise in medication management and psychotherapy',
            phone: '+1-555-0109',
            location: 'Denver, USA',
            website: 'https://drjameswilson.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/drjameswilson'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Maria Garcia',
            email: 'maria.garcia@example.com',
            password: 'user101',
            role: 'user',
            title: 'Student',
            bio: 'College student studying psychology and passionate about mental health awareness',
            phone: '+1-555-0110',
            location: 'Phoenix, USA',
            socialLinks: {
                instagram: 'https://instagram.com/maria_studies'
            },
            isVerified: true,
            coursesEnrolled: 4,
            coursesCompleted: 2,
            totalSpent: 199.98,
            walletBalance: 10.00
        },
        {
            name: 'David Kim',
            email: 'david.kim@example.com',
            password: 'user202',
            role: 'user',
            title: 'Business Analyst',
            bio: 'Business professional focusing on personal development and mental wellness',
            phone: '+1-555-0111',
            location: 'Portland, USA',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/davidkim'
            },
            isVerified: true,
            coursesEnrolled: 1,
            coursesCompleted: 1,
            totalSpent: 89.99,
            walletBalance: 150.00
        },
        {
            name: 'Healthcare Solutions LLC',
            email: 'contact@healthcaresolutions.com',
            password: 'org456',
            role: 'admin',
            title: 'Healthcare Organization',
            bio: 'Healthcare solutions provider offering comprehensive mental health services',
            phone: '+1-555-0112',
            location: 'Dallas, USA',
            website: 'https://healthcaresolutions.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/company/healthcaresolutions'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Dr. Amanda Foster',
            email: 'amanda.foster@example.com',
            password: 'teacher202',
            role: 'teacher',
            title: 'Child Psychologist',
            bio: 'Child and adolescent psychologist specializing in developmental disorders and behavioral therapy',
            phone: '+1-555-0113',
            location: 'Atlanta, USA',
            website: 'https://dramandafoster.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/dramandafoster'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Corporate Health Partners',
            email: 'info@corporatehealth.com',
            password: 'org789',
            role: 'admin',
            title: 'Corporate Health Organization',
            bio: 'Specialized in corporate mental health programs and employee assistance programs',
            phone: '+1-555-0114',
            location: 'Houston, USA',
            website: 'https://corporatehealth.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/company/corporatehealth'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Dr. Lisa Anderson',
            email: 'lisa.anderson@example.com',
            password: 'teacher999',
            role: 'teacher',
            title: 'Trauma Specialist',
            bio: 'Trauma-informed therapist specializing in PTSD treatment, EMDR therapy, and trauma recovery programs',
            phone: '+1-555-0115',
            location: 'Denver, USA',
            website: 'https://drlisaanderson.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/drlisaanderson',
                twitter: 'https://twitter.com/dr_lisa_a'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
        },
        {
            name: 'Dr. Robert Martinez',
            email: 'robert.martinez@example.com',
            password: 'teacher888',
            role: 'teacher',
            roles: ['teacher'], // Thêm trường roles array
            title: 'Family Therapist',
            bio: 'Family therapist specializing in relationship counseling, couples therapy, and family dynamics',
            phone: '+1-555-0116',
            location: 'Phoenix, USA',
            website: 'https://drrobertmartinez.com',
            socialLinks: {
                linkedin: 'https://linkedin.com/in/drrobertmartinez',
                twitter: 'https://twitter.com/dr_robert_m'
            },
            isVerified: true,
            coursesEnrolled: 0,
            coursesCompleted: 0,
            totalSpent: 0,
            walletBalance: 0
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