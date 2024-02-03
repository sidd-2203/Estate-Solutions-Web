import express from "express";
import { signIn, singup, googleSignIn } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", singup);
authRouter.post("/signin", signIn);
authRouter.post("/google", googleSignIn);
export default authRouter;