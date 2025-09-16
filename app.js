import express from 'express';
import path from "path"
import serveIndex from 'serve-index';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import jwt1 from 'jsonwebtoken';
import multer from "multer"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import routers from './routes/login.js';
import signup from './routes/signup.js';
import logging from './server_logs/logs.js';
import playlistCreate from './playlistCreator.js';



dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const logs = (req, res, next) => {
    console.log(`${new Date().toLocaleString()}  ${req.method}  ${req.originalUrl}`);
    logging(`${new Date().toLocaleString()}  ${req.method}  ${req.originalUrl}`);
    next();
}

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"uploads"))
    },
    filename:(re,file,cb)=>{
        if(file.fieldname=="CoverPage"){
            cb(null,"cover.png")
        }
        cb(null,file.originalname)
    }
})

const upload=multer({storage})

app.use(logs);

app.use(bodyParser.json());
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // allow all
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    next();
});

function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        console.log("working");
        const dec=jwt1.verify(token.split(" ")[1], JWT_SECRET);
        
        if (dec == null) {
            return res.status(401).json({ message: "Invalid token api" });
        }
        else {
                req.user = dec;
                console.log(req.user);
                next();
            }
        }catch(err){
            return res.status(401).json({ message: "Invalid token error" });

        }
}



app.use(express.static('public'));
app.set('view engine', 'ejs')
app.use("/public", express.static(path.joigitn(__dirname + "/song_db")));
app.use("/public", serveIndex(path.join(__dirname + "/song_db"), { "icons": true }));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.use("/login", routers)
app.use("/signup", signup)


app.get("/te", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index2.html"));
});


app.post("/protected",auth,upload.fields([{name:"CoverPage"},{name:"Songs"}]),(req, res) => {
    console.log(req.user)
    const name=(req.body.playlistName)
    const dec=(req.body.dec)
    console.log(dec)
    if(playlistCreate(name,dec)==0)
        res.status(400).json({message:"PlayLIst Exists"})
    
    res.status(200).json({data:req.user, message: "This is protected data."});
});

app.get("/createPlaylist", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "createPlaylist.html"));
})

app.listen(PORT, () => {
    console.log();
});