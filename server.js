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

(async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
        });


    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})

();