import mongoose from "mongoose";
import dotenv from "dotenv";

import logging from "../server_logs/logs.js";

dotenv.config();

const mongo_url = process.env.MONGO_URL;

await mongoose.connect(mongo_url)

const db = mongoose.connection;

db.on("connected",() => {
    console.log(`${new Date().toLocaleString()} Connected to database`);
    logging(`${new Date().toLocaleString()} Connected to database`);
});

db.on("error",() => {
    console.log(`${new Date().toLocaleString()} Connected to database`);
    logging(`${new Date().toLocaleString()} Connected to database`);
});

db.on("disconnected",() => {
    console.log(`${new Date().toLocaleString()} Connected to database`);
    logging(`${new Date().toLocaleString()} Connected to database`);
});

export default db;