import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(400).json({success:false, message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = generateVerificationCode(); // 6-digit token

        // Create a new user
        const user = new User({
            fullName,
            email,
            password: hashedPassword,
            verificationToken,
            verificationExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Token valid for 24 hours
        });

        await user.save();

        //jwt
        generateTokenAndSetCookie(res, user._id);

        await sendVerificationEmail(user.email, verificationToken);

        res.status(201).json({
             success: true,
             message: "User created successfully", 
             user: {
                ...user._doc, // Spread operator to include all user fields
                password: undefined, // Exclude password from response
             }
            });

    } catch (error) {
        res.status(400).json({ success: false, message: "Error occurred during signup", error: error.message });
    }  
}

export const verifyEmail = async (req, res) => {
    const {code} = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpiresAt: { $gt: new Date() } // Check if token is still valid
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }

        // If token is valid, mark user as verified & clear token & token expiration
        user.isVerified = true;
        user.verificationToken = undefined; 
        user.verificationExpiresAt = undefined; 
        await user.save();

        await sendWelcomeEmail(user.email, user.fullName);

        res.status(200).json({ 
            success: true, 
            message: "Email verified successfully" ,
            user: {
                ...user._doc, // Spread operator to include all user fields
                password: undefined, // Exclude password from response
            },
        });
    } catch (error) {
        console.error("Error in verifyEmail", error);
        res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: error.message 
        });
    }
}

export const login = async (req, res) => {
    res.send("Login Route");
}
export const logout = async (req, res) => {
    res.clearCookie("token"); // Clear the token cookie
    res.status(200).json({ success: true, message: "Logged out successfully" });
}