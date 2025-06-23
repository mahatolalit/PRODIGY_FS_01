import { User } from "../models/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateVerificationCode } from "../utils/generateVerificationCode.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

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
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                ...user._doc, // Spread operator to include all user fields
                password: undefined, // Exclude password from response
            }
        });
    } catch (error) {
        console.error("Error in login", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}
export const logout = async (req, res) => {
    res.clearCookie("token"); // Clear the token cookie
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        // Generate a password reset token is user exists
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 20 * 60 * 1000); // Token valid for 20 minutes

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        // Send reset password email
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ 
            success: true, 
            message: "Password reset email sent successfully" 
        });

    } catch (error) {
        console.log("Error in forgotPassword", error);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: new Date() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired password reset token" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user's password and clear reset token and expiration
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ 
            success: true, 
            message: "Password reset successfully" 
        });
    
    } catch (error) {
            console.log("Error in resetPassword", error);
            return res.status(500).json({ success: false, message: "Server error", error: error.message });
        }
        
}

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password"); // Exclude password from response
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ 
            success: true, 
            user 
        });
    } catch (error) {
        console.error("Error in checkAuth", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}