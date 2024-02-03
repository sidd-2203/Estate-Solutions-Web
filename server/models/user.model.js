import { Timestamp } from "mongodb";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw0WGNDernhpn7Oi1i6x3y-9&ust=1707067828348000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNiBvbTZj4QDFQAAAAAdAAAAABAE",
    }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);
export default User;