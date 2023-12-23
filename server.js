const express = require ("express")
const session = require ("express-session")
const path = require ("path")
const mongoAction = require("./userHandler")
const port = 3000

const app = express()

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.SESSION_SECRET
}))

app.use((req, res, next)=>{
  if(!req.session.user){
    return res.redirect("/login")
  }
  next()
})

app.get("/login", (req, res)=>{
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.post("/login", async (req, res)=>{
  const esitoDb = await mongoAction("login", req.body)
  res.send(`Logged as ${esitoDb ? esitoDb : "none"}`)
})

application.listen(()=>{
  console.log("listening "+port)
})