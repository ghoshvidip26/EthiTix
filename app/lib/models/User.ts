import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const userSchema = new Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true,
    }
});

export default mongoose.models.User || mongoose.model("User", userSchema);