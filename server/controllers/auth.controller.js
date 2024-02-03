import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

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