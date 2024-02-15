const GoogleStrategy = require('passport-google-oauth20').Strategy; // Import the Google OAuth2.0 Strategy for Passport
const User = require('../model/userSchema'); // Import the User model
const passport = require('passport'); // Import Passport for authentication

module.exports = function (passport) {
  // Configure the Google OAuth2.0 Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID, // Your Google OAuth client ID
        clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google OAuth client secret
        callbackURL: 'http://localhost:8000/google/callback', // The callback URL after Google authentication
        passReqToCallback: true, // Pass the request to the callback function
      },
      // Callback function for handling Google authentication
      async (request, accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleID: profile.id, // Google user ID
          name: profile.displayName, // User's display name
          email: profile._json.email, // User's email obtained from the Google profile
        };
        try {
          // Check if the user with the same Google ID exists in the database
          let user = await User.findOne({ googleID: profile.id });
          if (user) {
            done(null, user); // User found, authenticate and pass the user to Passport
          } else {
            // If user doesn't exist, create a new user with Google credentials
            user = await User.create(newUser);
            done(null, user); // Authenticate and pass the newly created user to Passport
          }
        } catch (error) {
          console.log('Error via Google register: ', error); // Log an error in case of any issues
        }
      }
    )
  );

  // Serialize the user's ID to the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize the user from the session by ID
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .exec() // Execute the query to find the user by ID
      .then(user => {
        done(null, user); // Pass the user to Passport
      })
      .catch(err => {
        done(err, null); // Handle errors if any
      });
  });
};
