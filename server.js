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
// Seeding is now handled by src/seed/index.js

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
            console.log(`To seed the database, run: node src/seed/index.js`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})()