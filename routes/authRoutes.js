const passport = require('passport');

// Authentication route
exports.login = passport.authenticate('local', { successRedirect: '/getMyboi', failureRedirect: '/login' });

// Middleware to check if the user is authenticated
exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Logout route
exports.logout = (req, res) => {
  req.logout();
  res.redirect('/login');
};
