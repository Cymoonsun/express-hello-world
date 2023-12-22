const express = require("express");
const app = express();
const path = require("path")
const { MongoClient } = require("mongodb")
const port = 3000;

app.use(express.static(path.join(__dirname+"/public")))

const mongoUri = "mongodb+srv://Cymoon:Cymoongo0@cluster0.zwuqr5f.mongodb.net/?retryWrites=true&w=majority"
const client = new MongoClient(mongoUri)
client.connect.then(()=>{
  console.log("connected to db")
}).catch(err => console.error('Error connecting to the database:', err));

app.get("/getText", (req, res) => {
  res.send("Hello World!");
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});