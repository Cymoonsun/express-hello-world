const app = require('./app');

const port = process.env.PORT || 3000;

app.get('/getRandomNumber', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  console.log(res)
  console.log(randomNumber)
  res.json({ randomNumber });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
