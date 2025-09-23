// server.js
// Main entry point: loads env, connects DB, starts Express server with Socket.IO
require('dotenv').config();
const http = require('http');
const {
    connectDB
} = require('./src/config/db');
const app = require('./app');
const {
    PORT
} = require('./src/config/serverConfig');
const {
    initSocket
} = require('./src/config/socketConfig');
// Seeding is now handled by src/seed/index.js

(async () => {
    try {
        await connectDB();

        const server = http.createServer(app);
        const io = initSocket(server);

        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
            console.log(`Socket.IO enabled for real-time features`);
            console.log(`To seed the database, run: node src/seed/index.js`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
})()