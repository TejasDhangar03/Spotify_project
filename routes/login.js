import express from "express";
import path from "path"
import bodyParser from 'body-parser';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import User from '../models/users.js';
import genToken from '../Auth/jwt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public", "login.html"));
})

router.post("/", async (req, res) => {
    const data = req.body;
    // console.log(data);

    try {

        const user = await User.findOne({ username: data.username });

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const isMatch = await user.comparePassword(data.password);
        if (isMatch) {
            const utoken = genToken.genToken(user);
            console.log(utoken);

            return res.status(200).cookie("token", utoken, {
                httpOnly: true,
                secure: false,     // only true in production
                sameSite: "lax" // "none" for cross-site production, "lax" for local
            }).json({ message: "Login successful", token: utoken });

            // return res.status(200).json({ message: "Login successful", token: utoken });
        }
        else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in" });
    }
})

const routers = router

export default routers;