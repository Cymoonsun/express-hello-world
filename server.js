import { fileURLToPath } from 'url';
import { dirname } from 'path';
import express from 'express';
import session from 'express-session';
import path from 'path';
import queryString from 'querystring';
import cors from "cors"
import cookieParser from "cookie-parser"
import MongoStore from 'express-session-mongo'
import multer from "multer"
import mongoAction from './userHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
let MemoryStore = session.MemoryStore

const port = 3000;
const app = express();

app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('trust proxy', true);

const corsOptions = {
  origin: '*',
  credentials: true };

app.use(cors(corsOptions));

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024, // 4MB limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image file.'));
    }

    cb(undefined, true);
  }
});

app.use(
  session({
    saveUninitialized: true,
    resave: false,
    secret: process.env.SESSION_SECRET,
    name: 'SuperCoolSession',
    cookie:{
      secure: true,
      sameSite: 'none',
      maxAge: 1000 * 60 * 60 * 48,
      store: new MongoStore({ url: process.env.MONGO_CONNECTION_STRING }),
      httpOnly: false
    }
  })
);

app.use((req, res, next) => {
  if (!req.session.user && !req.path.startsWith('/login') && !req.path.startsWith('/signup')) {
    return res.redirect('/login');
  }
  next();
});

app.get('/login', (req, res) => {
  if (req.session.user) {
    return res.redirect('/content');
  }
  res.sendFile(path.join(__dirname, 'public', 'authHandler', 'login.html'));
});

app.post('/login', async (req, res) => {
  let result = await mongoAction('login', req.body);
  if (result.result) {
    req.session.user = {
      username: req.body.username
    };
    res.redirect('/content');
  } else {
    const query = queryString.stringify(result);
    res.redirect(`${result.data?.redirectTo}?${query}`);
  }
});

app.get('/signup', (req, res) => {
  if (req.session.user) {
    return res.redirect('/content');
  }
  res.sendFile(path.join(__dirname, 'public', 'authHandler', 'signup.html'));
});

app.post('/signup', async (req, res) => {
  let result = await mongoAction('signup', req.body);
  if (result.result) {
    req.session.user = {
      username: req.body.username
    };
    res.redirect('/content');
  } else {
    const query = queryString.stringify(result);
    res.redirect(`${result.data.redirectTo}?${query}`);
  }
});

app.get('/logout', (req, res) => {
  delete req.session.user;
  res.redirect('/login');
});

function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

app.use(['/content',
 '/api/user',
 "/user/uploadPic",
 "/getPicFlow",
 "/sendFriendRequest", 
 "/getFriendRequests", 
 "/getFriends"], requireLogin);

app.get('/content', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'loggedSections', 'loggedSections.html'));
});

app.get('/api/user', (req, res) => {
  if (!req.session.user) return res.send(null);
  return res.json(req.session.user);
});

app.post('/user/uploadPic', upload.single('upPic'), async (req, res) => {
  if(!req.session.user) return res.send("u criminal scum")
  const mongoResult = await mongoAction("uploadPic", req)
  return res.json(mongoResult)
});

app.get("/getPicFlow", async (req, res)=>{
  const mongoResult = await mongoAction("getAllPics", req)
  res.json(mongoResult)
})

app.get("/getFriendRequests", (req, res)=>{
  
})

app.post("/sendFriendRequest", async (req, res)=>{
  const mongoResult = await mongoAction("sendFriendRequest", req)
  res.json(mongoResult)
})

app.get("/getFriends", async (req, res) => {
  const mongoResult = await mongoAction("getFriends", req);
  res.json(mongoResult);
});


app.get("/media/:name",(req, res)=>{
  res.sendFile(path.join(__dirname,"media",req.params.name))
})

app.post("/sendGuess", async (req, res)=>{
  const mongoResult = await mongoAction("sendGuess", req)
  res.json(mongoResult)
})

app.get("/*", (req, res) => {
  if (!req.path.includes(".")) {
    const custom404PagePath = path.join(__dirname, "public", "404.html");
    res.status(404).sendFile(custom404PagePath);
  } else {
    res.status(404).send('Not Found');
  }
});

app.listen(port, () => {
  console.log('listening ' + port);
});

