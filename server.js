const app = require('./app');

const port = process.env.PORT || 3000;

app.get('/getText', (req, res) => {
  res.send("Here is text");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
