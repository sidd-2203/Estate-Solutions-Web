import express from "express";
import { signIn, singup, googleSignIn, signOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", singup);
authRouter.post("/signin", signIn);
authRouter.post("/google", googleSignIn);
authRouter.get("/signout", signOut);
export default authRouter;