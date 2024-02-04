import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        return (errorHandler(401, "You can only update your own account"));
    }
    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true }); // returns the updated user info in response
        const { password, ...rest } = updateUser._doc;
        res.status(200).json(rest);
    }
    catch (err) {
        next(errorHandler(500, "Something went wrong!!"));
    }
}