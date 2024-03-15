import express, {Request, Response} from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'

const router = express.Router();

// POST route for user login
router.post("/login", [
    // Validate email and password
   check("email", "Email is required").isEmail(), 
   check("password", "Password with 6 or more charactes is required").isLength({min: 6})
], async (req : Request, res : Response) => { 
    // Check for validation errors
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
        message : errors.array()
        })
    }
    // Check for validation errors
    const { email, password } = req.body; 
    try {
        // Find user in the database
        const user = await User.findOne({email})
        if(!user) {
            return res.status(400).json({message : "Invalid Credentials"})
        }
        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            return res.status(400).json({message : "Invalid Credentials"})
        }

        // Create and send JWT token
        const token = jwt.sign({userId : user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn : "1d"})
        res.cookie("auth_token", token, {
            httpOnly: true, 
            secure : process.env.NODE_ENV === "production", 
            maxAge : 86400000
        })
        res.status(200).json({userId : user._id})
    } catch (error) { 
         // Handle errors
        console.log(error);
        res.status(500).json({message : "Something went worng..."})
    }

})

export default router;