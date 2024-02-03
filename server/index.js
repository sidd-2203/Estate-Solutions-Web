import express, { Router } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = 3000;
app.use(express.json());

app.use("/api/user", userRouter);
app.use('/api/auth', authRouter);
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err)
})
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})
app.get('/test', (req, res) => {
    res.send("hello world");
})
