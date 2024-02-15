const mongoose = require("mongoose"); // Import the Mongoose library for working with MongoDB
const db = require('../controller/database/connection'); // Import the database connection configuration

// Define the user schema using Mongoose
const userSchema = mongoose.Schema({
    email: {
        type: String,
        // Add other properties like 'required', 'unique', etc. as needed
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        minlength: 6, // Set a minimum password length
    },
    confirmPassword: {
        type: String,
        minlength: 6, // Set a minimum confirmPassword length
    },
    Newpassword: {
        type: String,
        // Add other properties as needed
    },
    profilePicture:{
        type: String,
        // required: true
    },
  
    googleID: { 
        type: String,
        // Add other properties as needed
    }
   
});

// Create a Mongoose model for the "User" collection using the user schema
const User = mongoose.model("User", userSchema);

module.exports = User; // Export the User model for use in the application
