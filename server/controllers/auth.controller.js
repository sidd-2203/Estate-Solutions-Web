import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const singup = async (req, res, next) => {
    //console.log(req.body);
    try {
        const { username, email, password } = req.body;
        const hashedPassword = bcryptjs.hashSync(password, 10);
        //console.log(hashedPassword);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ success: true, msg: "New User created Successfully" });
    } catch (err) {
        next(errorHandler(500, err.message));
    }
}
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, "Wrong Credentials!!"));

        const { password: pass, ...restInfo } = validUser._doc;

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
        res.cookie('access_token', token, { httpOnly: true, expires: new Date(Date.now() + 24 * 60 * 60 * 2) }).status(200).json(restInfo);
    } catch (err) {
        next(errorHandler(501, err.message));
    }
}