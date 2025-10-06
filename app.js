// app.js
// Configures Express app, middlewares, routers, Swagger, error handler
const express = require('express');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./src/config/passportConfig');
const {
    corsMiddleware,
    helmetMiddleware
} = require('./src/config/securityConfig');
const {
    setupSwagger
} = require('./src/config/swaggerConfig');
const errorHandler = require('./src/middlewares/errorHandler');

// create for api 
const authRoutes = require('./src/routes/authRoutes');
const blogRoutes = require('./src/routes/blogRoutes');
const userRoutes = require('./src/routes/userRoutes');
const workingHourRoutes = require('./src/routes/workingHourRoutes');
const teacherRoutes = require('./src/routes/teacherRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const forumRoutes = require('./src/routes/forumRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const paymentRoutes = require('./src/routes/paymentRoutes');

const app = express();

app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan('dev'));

// Session middleware for Passport
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Mount API routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/working-hours', workingHourRoutes);
app.use('/api/v1/teachers', teacherRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/forum', forumRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Swagger docs
setupSwagger(app);

// Global error handler (last)
app.use(errorHandler);

module.exports = app;