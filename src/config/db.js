// src/config/db.js
// Handles MongoDB connection using Mongoose
const mongoose = require('mongoose');

// Optional debug output when DEBUG_MONGOOSE=1
if (process.env.DEBUG_MONGOOSE === '1') {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        console.log(`[mongoose:${collectionName}.${method}]`, JSON.stringify(query), doc ? JSON.stringify(doc) : '');
    });
}

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI environment variable is not defined');
        }

        console.log('🔄 Attempting MongoDB connection...');
        console.log('📍 Connection string starts with:', process.env.MONGODB_URI.substring(0, 20) + '...');

        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // Timeout sau 10 giây
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ MongoDB connected successfully');
        console.log('📊 Database name:', mongoose.connection.name);
    } catch (err) {
        console.error('❌ MongoDB connection error:');
        console.error('Error name:', err.name);
        console.error('Error message:', err.message);
        if (err.reason) {
            console.error('Error reason:', err.reason);
        }
        throw err;
    }
};

module.exports = {
    connectDB
};