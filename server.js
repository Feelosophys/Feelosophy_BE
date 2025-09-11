// server.js
// Main entry point: loads env, connects DB, starts Express server
require('dotenv').config();
const {
    connectDB
} = require('./src/config/db');
const app = require('./app');
const {
    PORT
} = require('./src/config/serverConfig');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const defaultUsers = [{
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        roles: ['admin'],
        bio: 'Platform administrator'
    },
    {
        name: 'Default User',
        email: 'user@example.com',
        password: 'user123',
        roles: ['user'],
        bio: 'Default learner'
    },
    {
        name: 'Teacher',
        email: 'teacher@example.com',
        password: 'teacher123',
        roles: ['teacher'],
        bio: 'Consultation teacher'
    },
    {
        name: 'Instructor',
        email: 'instructor@example.com',
        password: 'instructor123',
        roles: ['instructor'],
        bio: 'Course instructor'
    },
    {
        name: 'Organization',
        email: 'org@example.com',
        password: 'org123',
        roles: ['organization'],
        bio: 'Organization account'
    }
];

async function seedDefaultUsers() {
    for (const user of defaultUsers) {
        const exists = await User.findOne({
            email: user.email
        });
        if (!exists) {
            user.password = await bcrypt.hash(user.password, 10);
            await User.create(user);
            console.log(`Created default: ${user.email}`);
        } else {
            console.log(`Default exists: ${user.email}`);
        }
    }
}

(async () => {
    try {
        await connectDB();
        await seedDefaultUsers();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });


    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})()