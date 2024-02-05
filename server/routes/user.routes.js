import express, { Router } from 'express';
import { updateUser, deleteUser, getUserListing } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const userRouter = express.Router();

userRouter.post('/update/:id', verifyToken, updateUser);
userRouter.delete('/delete/:id', verifyToken, deleteUser);
userRouter.get('/listings/:id', verifyToken, getUserListing);
export default userRouter;
