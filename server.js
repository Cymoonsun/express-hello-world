const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Define the getRandomNumber endpoint
app.get('/getRandomNumber', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  res.json({ randomNumber });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
