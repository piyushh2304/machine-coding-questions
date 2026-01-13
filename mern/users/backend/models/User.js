import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        dob: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);
