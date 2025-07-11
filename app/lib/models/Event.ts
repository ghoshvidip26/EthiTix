import dbConnect from "./mongodb";
import { Schema } from "mongoose";
import mongoose from "mongoose";

dbConnect();

const eventSchema = new Schema({
    eventName: {
        type: String,
        required: true,
    },
    descriptionOfEvent: {
        type: String,
        required: true,
    },
    eventDate: {
        type: Date,
        required: true,
    },
    eventLocation: {
        type: String,
        required: true,
    },
    capacityOfEvent: {
        type: Number,
        required: true,
    }
});

export default mongoose.models.Event || mongoose.model("Event", eventSchema);