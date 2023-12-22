const express = require("express");
const app = express();
const path = require("path")
const { MongoClient } = require("mongodb")
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');
const port = 3000;

app.use(express.static(path.join(__dirname+"/public")))

//passport stuff
app.use(expressSession({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  const user = users.find(u => u.id === id);
  done(null, user);
});

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

app.get("/getMyboi", (req, res)=>{
  req.db.collection('DataTest').find().toArray().then((data)=>{
    res.json(data)
  })
})

app.use((req, res, next) => {
  // Close the MongoDB connection
  if (req.db) {
    req.db.close()
      .then(() => console.log('MongoDB connection closed'))
      .catch(err => console.error('Error closing MongoDB connection:', err));
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});