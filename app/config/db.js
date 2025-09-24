require('dotenv').config();
const mongoose = require('mongoose');

function connectDB() {
    // Database connection with proper configuration
    mongoose.connect(process.env.MONGO_CONNECTION_URL, {
        // Remove deprecated options that are no longer needed in modern versions
    });
    
    const connection = mongoose.connection;

    connection.on('error', err => {
        // Handle database connection error
        console.error('Database connection error:', err);
    });

    connection.once('open', () => {
        // MongoDB connected successfully
        console.log('Database connected 🥳🥳🥳🥳');
    });

    // Handle connection events
    connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    });

    // Handle application termination
    process.on('SIGINT', async () => {
        try {
            await connection.close();
            console.log('MongoDB connection closed through app termination');
            process.exit(0);
        } catch (err) {
            console.error('Error closing MongoDB connection:', err);
            process.exit(1);
        }
    });
}

module.exports = connectDB;


//1ER26LQWjrRVpLNO