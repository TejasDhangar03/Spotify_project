import express from 'express';
import path from "path"
import serveIndex from 'serve-index';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jwt1 from 'jsonwebtoken';
import multer from "multer"
import cors from "cors";
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import routers from './routes/login.js';
import signup from './routes/signup.js';
import logging from './server_logs/logs.js';
import playlistCreate from './Functions/playlistCreator.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;

const logs = (req, res, next) => {
    console.log(`${new Date().toLocaleString()}  ${req.method}  ${req.originalUrl}`);
    logging(`${new Date().toLocaleString()}  ${req.method}  ${req.originalUrl}`);
    next();
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"))
    },
    filename: (re, file, cb) => {
        if (file.fieldname == "CoverPage") {
            cb(null, "cover.png")
        }
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

app.use(logs);

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser())
app.use(cors());

function auth(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        console.log(token);

        const token1 = jwt1.verify(token, JWT_SECRET);

        if (token1 == null) {
            return res.status(401).json({ message: "Invalid token api" });
        }
        else {
            req.user = token1;
            console.log(req.user);
            next();
        }
    } catch (err) {
        console.log(err)
        return res.status(401).json({ message: "Invalid token error" });

    }
}

app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use("/public", auth, express.static(path.join(__dirname + "/song_db")));
app.use("/public", serveIndex(path.join(__dirname + "/song_db"), { "icons": true }));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/login", routers)
app.use("/signup", signup)

app.get("/logout", auth, (req, res) => {
    res.clearCookie("token"); // cookie name must match what you set
    res.json({ message: "Logged out successfully" });
});

app.get("/te", auth, (req, res) => {
    console.log(req.user.username)
    console.log("worje")
    res.sendFile(path.join(__dirname, "/public/index2.html"));
});

app.post("/protected", auth, upload.fields([{ name: "CoverPage" }, { name: "Songs" }]), (req, res) => {
    console.log(req.user)
    const name = (req.body.playlistName)
    const dec = (req.body.dec)
    console.log(dec)
    if (playlistCreate(name, dec) == 0)
        res.status(400).json({ message: "PlayList Exists" })

    res.status(200).json({ data: req.user, message: "This is protected data." });
});

app.get("/createPlaylist", auth, (req, res) => {
    res.status(201).sendFile(path.join(__dirname, "public", "createPlaylist.html"));
})

app.listen(PORT, () => {
    console.log("Server Is UP!!!!!!!!");
});