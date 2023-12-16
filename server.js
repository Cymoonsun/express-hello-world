// Example of web server written with Express

const express = require("express");
const app = express();
const port = 3000;

app.get("/getText", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});