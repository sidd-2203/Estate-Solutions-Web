import express, { Router } from 'express';
import { updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const userRouter = express.Router();

userRouter.post('/update/:id', verifyToken, updateUser);
export default userRouter;
