import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import { listingRouter } from "./routes/listing.route.js";
import path from 'path';

dotenv.config();


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    //console.log(err)
})



const app = express();
const PORT = 3000;

const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
// code for deploying on the render to create a static folder so that can access index.html from frontend

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})


// global catch
// error handling middleware

app.use((err, req, res,_) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})


