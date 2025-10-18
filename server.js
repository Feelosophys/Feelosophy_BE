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
    // ===== Kiểm tra biến môi trường =====
    console.log('🔍 Checking environment variables...');
    if (!process.env.MONGODB_URI) {
      throw new Error('❌ MONGODB_URI is not defined in environment variables');
    }
    console.log('✅ MONGODB_URI found');

    // ===== Kết nối MongoDB =====
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();
    console.log('✅ MongoDB connected successfully');

    // ===== Tạo HTTP server + Socket.io =====
    console.log('🔄 Creating HTTP server...');
    const server = http.createServer(app);
    initSocket(server);
    console.log('✅ Socket.IO initialized');

    // ===== Lắng nghe cổng =====
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📘 Swagger docs: http://localhost:${PORT}/api-docs`);
      console.log(`🔌 Socket.IO enabled`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Stack trace:', err.stack);
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
