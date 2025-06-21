import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, userId) => {
    // Generate JWT token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token valid for 7 day
    });

    // Set the token in a cookie
    res.cookie('token', token, {
        httpOnly: true, 
        secure: process.env.NODE_ENV === "production", 
        sameSite: 'Strict', 
        maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 day
    });

    return token;
}