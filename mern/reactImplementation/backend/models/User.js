import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Removed required: true for Google users
    googleId: { type: String }, // New field
    avatar: { type: String },   // New field
}, { timestamps: true });
export default mongoose.model('User', userSchema);