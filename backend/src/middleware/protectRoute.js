import jwt from 'jsonwebtoken';

export const protectRoute = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized access - No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized access - Invalid token" });
        }
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error verifying token:", error);
        return res.status(401).json({ success: false, message: "Server error" });
    }
}