const mongoose = require('mongoose'); // Import Mongoose for working with MongoDB
const db = require('./database/connection'); // Import the database connection configuration
const User = require('../model/userSchema'); // Import the User model
require('dotenv').config(); // Load environment variables
const passport = require('passport'); // Import Passport for authentication
const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import the Google OAuth strategy
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { response } = require('express'); // Import Express and its response module
const e = require('express');
const multer  = require('multer')


 
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the provided email exists in the database
        const validEmail = await User.findOne({ email });
   

        if (!validEmail) {
            res.redirect("/upload"); // Redirect to the registration page or return an error response
        } else {
            // Compare the provided password with the hashed password in the database
            const isPassValid = await bcrypt.compare(password, validEmail.password);

            if (!isPassValid) {
                res.status(400).send("Invalid Details"); // Return an error response for invalid credentials
            } else {
                res.status(201).render("home", {
                   validEmail
                });
            }
        }
    } catch (error) {
        console.error("login", error);
    }
};

// Define the registration controller

module.exports.register = async (req, res, next) => {
    


    try {
        // Handle file upload
         

            const { email, name, password, confirmPassword , profilePicture } = req.body;

            // Check if the email already exists in the database
            const existsEmail = await User.findOne({ email });

            if (existsEmail) {
                // Email already exists, return an error response
                return res.status(400).redirect('/');
            }

            // Hash the user's password before saving it
            const hashPassword = await bcrypt.hash(password, 10);

            // Create a new user instance
            const newUser = new User({
                email,
                name,
                password: hashPassword,
                profilePicture : req.file ? req.file.filename : null,// Save the file path in the user model
            });

            if (password === confirmPassword) {
                await newUser.save();
                res.status(200).redirect('/');
            } else {
                res.status(400).json({ message: 'Confirm password mismatch' });
            }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred during registration.' });
    }
};
// Define the controller for updating the user's password
module.exports.updatePass = async (req, res) => {
    try {
        const email = req.body.email;
        const oldPassword = req.body.password;
        const Newpassword = req.body.Newpassword;

        // Check if the provided email exists in the database
        const isValidUser = await User.findOne({ email: email });

        if (!isValidUser) {
            res.redirect('/register');
        } else {
            // Compare the provided old password with the hashed password in the database
            const isPassValid = await bcrypt.compare(oldPassword, isValidUser.password);

            if (isPassValid) {
                // Hash the new password before updating it in the database
                const newHashedPassword = await bcrypt.hash(Newpassword, 10);

                // Update the user's password in the database
                await User.updateOne({ email: isValidUser.email }, { password: newHashedPassword });

                res.redirect('/');
            } else {
                res.send("Invalid details"); // Return an error response for invalid credentials
            }
        }
    } catch (error) {
        console.log(error);
    }
};
