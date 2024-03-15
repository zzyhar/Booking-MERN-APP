import express, { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";
import { check, validationResult } from "express-validator";

const router = express.Router();

// Route to handle user registration
// /api/users/register
router.post("/register", [
    // Validation for first name, last name, email, and password
    check("firstName", "First Name is Required").isString(),
    check("lastName", "Last Name is Required").isString(),
    check("email", "Email is Required").isString(),
    check("password", "Password with 6 or more characters is Required").isLength({ min: 6 }),
], async (req: Request, res: Response) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
    }

    try {
        // Check if user with the provided email already exists
        let user = await User.findOne({
            email: req.body.email,
        });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user
        user = new User(req.body);
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, { expiresIn: "1d" });

        // Set token as a cookie
        res.cookie("auth_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", maxAge: 86400000 });

        // Send success response
        return res.status(200).send({message : "User registered OK"});
    } catch (error) {
        // Handle errors
        console.log(error);
        return res.status(500).send({ message: "Something went wrong" });
    }
});

export default router;
