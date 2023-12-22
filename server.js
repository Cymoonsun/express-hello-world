const express = require("express");
const app = express();
const path = require("path")
const { MongoClient } = require("mongodb")
const port = 3000;

app.use(express.static(path.join(__dirname+"/public")))

// Middleware to connect to MongoDB
app.use((req, res, next) => {
  const uri = 'mongodb+srv://Cymoon:Cymoongo0@cluster0.zwuqr5f.mongodb.net/?retryWrites=true&w=majority';
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

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