const mongoose = require("mongoose"); // Import Mongoose for working with MongoDB
require('dotenv').config(); // Load environment variables

// Connect to the MongoDB database using the connection string from the environment variables
mongoose.connect(process.env.MONGO_URL )
    .then(() => console.log("MongoDB connected")) // Log a success message upon successful connection
    .catch((e) => console.log("MongoDB not connected")); // Log an error message if the connection fails

const db = mongoose.connection; // Get the MongoDB connection instance

module.exports = db; // Export the database connection instance for use in other parts of the application
