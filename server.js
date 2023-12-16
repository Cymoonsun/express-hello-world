const app = require('./app')

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get('/getRandomNumber', (req, res) => {
  const randomNumber = Math.floor(Math.random() * 100) + 1; // Change the range as needed
  res.json({ randomNumber });
});