import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the shape of a user object
export type UserType = {
    _id: string; 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string;
}

// Define a Mongoose schema for the user
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    password: { type: String, required: true },
    lastName: { type: String, required: true },
});

// Middleware to hash the password before saving
userSchema.pre("save", async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

// Create a Mongoose model for the user
const User = mongoose.model<UserType>("User", userSchema);

export default User;
