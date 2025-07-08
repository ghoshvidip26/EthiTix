import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const adminSchema = new Schema({
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

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);