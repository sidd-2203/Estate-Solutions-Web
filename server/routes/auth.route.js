import express from "express";
import { signIn, singup } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/signup", singup);
authRouter.post("/signin", signIn);
export default authRouter;