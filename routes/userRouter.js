// Import necessary modules and libraries
const express = require("express");
const router = express.Router();
const User = require('../model/userSchema'); // Import the user schema or relevant model
const controller = require('../controller/userController'); // Import the user controller
const passport = require('passport'); // Import Passport for authentication
const multer  = require('multer')
const bodyParser = require('body-parser')
router.use(express.static('../uploads'))
router.use(express.static('../views'))
const path = require('path')
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json())
// Route for rendering the registration page



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null , path.join(__dirname , '../uploads') , function(error , succsess){
        if (error)throw error 
      })
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname
        return cb(null, name , function(error , succsess1){
            if(error) throw error
        });

    },
});


const upload = multer({ storage: storage })
router.get("/upload", (req, res) => {
    res.render("register"); // Render the "register" view
});


// Route for handling user registration
router.post("/upload", upload.single('profilePicture'), controller.register);


// Route for rendering the login page
router.get("/", (req, res) => {
    res.render("login"); // Render the "login" view
});

// Route for handling user login
router.post("/", controller.login);

// Route for rendering the home page, only accessible if authenticated
router.get('/home', (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/'); // Redirect to the login page if not authenticated
    res.render('home'); // Render the "home" view
});

// Route for updating the password
router.post('/updatePass', controller.updatePass);

// Route for rendering the "update password" page
router.get('/updatePass', (req, res) => {
    res.status(201).render("updatePass"); // Render the "updatePass" view
});

// Route for Google OAuth authentication
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
);

// Callback route for Google OAuth authentication
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to the home page or another page
        res.redirect('/home');
    }
);

// Route for user logout
router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/");
    });
});
module.exports = router; // Export the router for use in the application
