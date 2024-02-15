// Import necessary modules and libraries
const express = require("express");
const app = express();
const path = require('path');
const ejs = require("ejs");
const passport = require('passport');
const session = require('express-session');
const route = require('./routes/userRouter'); // Import the userRouter or relevant route file here


// Load environment variables from a .env file

// Initialize Passport with the passport configuration
require('./config/passport')(passport);

// Enable parsing of URL-encoded data
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./views'))
app.use(express.static('./uploads'))
// Initialize the Express session
app.use(session({
  secret: 'keyboard cat', // Secret used to sign session ID cookies
  resave: false, // Don't save the session if it hasn't changed
  saveUninitialized: true // Save a session that is new but not modified
}));

// Initialize Passport and use it for authentication
app.use(passport.initialize());
app.use(passport.session());

// Define the path to the views directory
const viewPath = path.join(__dirname, "./views");
const publicPath = path.join(__dirname, "./public");


// Set the view engine and views path for rendering templates
app.set("view engine", "ejs");
app.set("views", viewPath);

app.use(express.static(publicPath))

// Define the routes for the root and "/auth" paths using the imported route
app.use("/", route);
app.use("/auth", route);

// Passport middleware configuration

// Start the server and listen on the specified port
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
