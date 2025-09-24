const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long']
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long']
    },
    role: { 
        type: String, 
        default: 'customer',
        enum: ['customer', 'admin']
    }
}, { 
    timestamps: true,
    strict: true, // Ensure only defined fields are saved
    strictQuery: true // Apply strict mode to queries as well
})

// Ensure email index is properly created
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema)