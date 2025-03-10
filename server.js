import express from "express";
import mongoose from "mongoose";
import { APP_PORT, MONGO_DB_URL } from "./config/index.js";
import cors from 'cors';
// import fileUpload from 'express-fileupload';
import {authRoute,followRoute,PostRoute} from "./routes/index.js";


const app = express();

// Database connection
mongoose.connect(MONGO_DB_URL, {
useNewUrlParser: true,
useUnifiedTopology: true,
dbName: 'Teravote'
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
console.log("DB connected...");
});

app.use(cors());
// app.use(fileUpload());
app.use(express.json({ limit: "50mb" }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/connect", followRoute);
app.use("/api/Post", PostRoute);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});


app.listen(APP_PORT, () => console.log("listening on port", APP_PORT));