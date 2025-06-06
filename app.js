// app.js
// Configures Express app, middlewares, routers, Swagger, error handler
const express = require('express');
const morgan = require('morgan');
const {
    corsMiddleware,
    helmetMiddleware
} = require('./src/config/securityConfig');
const {
    setupSwagger
} = require('./src/config/swaggerConfig');
const errorHandler = require('./src/middlewares/errorHandler');

const authRoutes = require('./src/routes/authRoutes');
// const courseRoutes = require('./src/routes/courseRoutes');
// const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app = express();

app.use(corsMiddleware);
app.use(helmetMiddleware);
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(morgan('dev'));

// Mount API routers
app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/courses', courseRoutes);
// app.use('/api/v1/appointments', appointmentRoutes);

// Swagger docs
setupSwagger(app);

// Global error handler (last)
app.use(errorHandler);

module.exports = app;