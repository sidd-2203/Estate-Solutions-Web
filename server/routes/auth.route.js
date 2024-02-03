import express from "express";
import { singup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", singup);
authRouter.post("/signin", singup);
export default authRouter;