const mongoose = require('mongoose')

const { Schema } = mongoose;

// Define the user schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        // unique: true, // Ensures that emails are unique
    },
    password: {
        type: String,
        required: true,
    },
});

// Create the User model
const UserModel = mongoose.model('User', UserSchema);

// Export the User model
module.exports = UserModel;
