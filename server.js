const express = require("express");
const app = express();
const path = require("path")
const Redis = require("redis")
const port = 3000;

const redisClient = Redis.createClient({
    password: 'q1Piyo5hnsiAdLJugFN2aUMTrhwtvRJu',
    socket: {
        host: 'redis-16643.c250.eu-central-1-1.ec2.cloud.redislabs.com',
        port: 16643
    }
});
const expire = 3600

app.use(express.static(path.join(__dirname+"/public")))

app.get("/getText", (req, res) => {
  res.send("Hello World!");
});

app.get("/getUser", (req, res)=>{
 redisClient.hGet("myUser", (err, user)=>{
      if (err) console.error(err)
      if(user != null){
        res.json(JSON.parse(user))
      }
  })
})

redisClient.on('error', (err) => {
  console.log('Redis error: ', err);
});

app.get('/getString', (req, res) => {
  // Replace 'your_key' with the key you want to get from Redis
  const key = 'test';

  redisClient.get(key, (err, reply) => {
      if (err) {
          res.status(500).send('Error retrieving data from Redis');
      } else {
          res.send(reply);
      }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});