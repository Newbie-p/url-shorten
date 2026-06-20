import mongoose, { mongo } from "mongoose";

const clickEventSchema = new mongoose.Schema({
    shortUrl: {
        type: String,
        required: true,
        index: true,
    },
    ip: {
        type: String,
    },
    country: {
        type: String,
        default: "unknown",
    },
     city: {
        type: String,
        default: "Unknown",
    },
    deviceType: {
        type: String,
        default: "Unknown",  // mobile, desktop, tablet
    },
    browser: {
        type: String,
        default: "Unknown",
    },
    os: {
        type: String,
        default: "Unknown",
    },
}, { timestamps: true});

const clickEvent = mongoose.model("ClickEvent", clickEventSchema);
export default clickEvent;