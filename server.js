const express = require("express");
const app = express();
const path = require("path")
const Redis = require("redis")
const port = 3000;

const redisClient = Redis.createClient().connect()
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});