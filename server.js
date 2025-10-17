// server.js
// Main entry point: loads env, connects DB, starts Express server with Socket.IO
require('dotenv').config();
const http = require('http');
const { connectDB } = require('./src/config/db');
const app = require('./app');
const { initSocket } = require('./src/config/socketConfig');

// ✅ PORT fallback cho Render
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    // ===== Kết nối MongoDB =====
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // ===== Tạo HTTP server + Socket.io =====
    const server = http.createServer(app);
    initSocket(server);

    // ===== Lắng nghe cổng =====
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
      console.log(`🔌 Socket.IO enabled`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();

// ===== Đảm bảo tiến trình không thoát sớm =====
process.on('uncaughtException', (err) => {
  console.error('❗ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❗ Unhandled Rejection:', reason);
});
