import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs';

export const updateUser = async (req, res, next) => {
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
        const { password, ...rest } = updatedUser._doc;
        res.clearCookie('access_token');
        res.status(200).json({ ...rest, success: true });
    }
    catch (err) {
        next(err);
    }
}
export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return next(errorHandler(401, "You can only delete your own account"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "User has been deleted" });
    } catch (error) {
        next(error);
    }
}

export const getUserListing = async (req, res, next) => {
    try {
        if (req.user.id === req.params.id) {
            const listings = await Listing.find({ userRef: req.user.id });
            res.status(200).json(listings);
        }
        else {
            return next(errorHandler(401, 'You can only view your own listing!!'));
        }
    } catch (error) {
        return next(error.message);

    }
}