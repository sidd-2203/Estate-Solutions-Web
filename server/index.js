import express, { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);

// global catch
// error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
})




mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err)
})
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})





