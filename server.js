const express = require("express");
const app = express();
const path = require("path")
const Redis = require("redis")
const port = 3000;

const redisClient = Redis.createClient({url:"redis-16837.c135.eu-central-1-1.ec2.cloud.redislabs.com:16837"})
const expire = 3600

app.use(express.static(path.join(__dirname+"/public")))

app.get("/getText", (req, res) => {
  res.send("Hello World!");
});

app.get("/getUser", (req, res)=>{
 redisClient.get("myUser", (err, user)=>{
      if (err) console.error(err)
      if(user != null){
        res.json(JSON.parse(user))
      }
  })
})

app.listen(port, async () => {
  await redisClient.connect()
  console.log(`Example app listening on port ${port}`);
});