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

app.get("/getString", (req, res)=>{
  redisClient.get("test", (err, data)=>{
    if (err) console.error(err)
    if(data != null){
      res.send(data)
    }
  })
})

app.listen(port, async () => {
  try{
    await redisClient.connect()
  }
  catch(err){
    console.error(err)
  }
  console.log(`Example app listening on port ${port}`);
});