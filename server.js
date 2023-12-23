const express = require("express");
const app = express();
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const port = 3000;

// Passport configuration
passportSecret = process.env.PASSPORT_SECRET;
app.use(expressSession({ secret: passportSecret, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id.toString());
});

passport.deserializeUser((id, done) => {
  const uri = process.env.MONGO_CONNECTION_STRING;
  const client = new MongoClient(uri);

  client.connect()
    .then(() => {
      return client.db().collection('DnDUsers').findOne({ _id: new ObjectId(id) });
    })
    .then(user => {
      client.close();
      done(null, user);
    })
    .catch(err => {
      console.error('Error deserializing user:', err);
      done(err, null);
    });
});

// Configure the local strategy for use by Passport
passport.use(new LocalStrategy(
  (username, password, done) => {
    const uri = process.env.MONGO_CONNECTION_STRING;
    const client = new MongoClient(uri);

    client.connect()
      .then(() => {
        return client.db().collection('users').findOne({ username, password });
      })
      .then(user => {
        client.close();
        if (!user) {
          return done(null, false, { message: 'Incorrect username or password.' });
        }
        return done(null, user);
      })
      .catch(err => {
        console.error('Error authenticating user:', err);
        done(err, false);
      });
  }
));

// Middleware to connect to MongoDB
app.use((req, res, next) => {
  const uri = process.env.MONGO_CONNECTION_STRING;
  const client = new MongoClient(uri);

  client.connect()
    .then(() => {
      // Attach the MongoDB client to the request object for later use
      req.db = client.db(); // Attach the MongoDB database object to the request
      next(); // Move on to the next middleware or route handler
    })
    .catch(err => {
      console.error('Error connecting to the database:', err);
      res.status(500).send('Internal Server Error');
    });
});

// Display login form
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Authentication route
app.post('/login',
  passport.authenticate('local', { successRedirect: '/getMyboi', failureRedirect: '/login' })
);

// Sample protected route
app.get('/getMyboi', isLoggedIn, (req, res) => {
  req.db.collection('DataTest').find().toArray().then((data) => {
    res.json(data);
  });
});

// Logout route
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Close MongoDB connection middleware
app.use((req, res, next) => {
  if (req.db) {
    req.db.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
