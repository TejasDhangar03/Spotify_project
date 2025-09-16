import express from "express";
import path from "path"

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import User from '../models/users.js';
import db from '../database/db.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/", (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, "../public", "signup.html"));
})

router.post("/", async (req, res) => {
    const data = req.body;
    
    // console.log(data);

    try {
        const newUser = new User(data);
        await newUser.save();
        res.status(201).json({ message: "User Created!!!" });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Username already exists / Error creating user" });
    }

})

const signup = router

export default signup;