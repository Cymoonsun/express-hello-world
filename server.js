const express = require ("express")
const session = require ("express-session")
const path = require ("path")
const ejs = require ("ejs")
const mongoAction = require("./userHandler")
const port = 3000

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.SESSION_SECRET || "secretCat"
}))

app.use((req, res, next)=>{
  if (!req.session.user && req.path !== "/login") {
    return res.redirect("/login");
  }
  next();
})

app.get("/login", (req, res)=>{
  if(req.session.user){
    res.sendFile(path.join(__dirname, "public", "loggedSection.html"))
  }
  res.sendFile(path.join(__dirname, "public", "login.html"))
})

app.post("/login", async (req, res)=>{
  mongoAction("login", req.body).then((result)=>{
    console.log(result)
    result && (req.session.user={
      username: result.username
    })
    res.send(`Logged as ${result ? result.username : "none"}`)
  })
})

app.get("/logout", (req, res)=>{
  delete req.session.user
  res.redirect("/login")
})

app.get("/content", (req, res)=>{
  ejs.renderFile(path.join(__dirname, "public", "loggedSections.ejs"), {name: req.session.user.username})
})

app.listen(port, ()=>{
  console.log("listening "+port)
})