const JWT = require("jsonwebtoken");
const User = require("../models/User");

// middleware protect routes
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];   // extract token
            const decoded = JWT.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password");
            next();
        } else {
            res.status(401);
            throw new Error("Not authorized, token failed");
        }
    } catch (error) {
        res.status(401).json({
            message: "Token Failed", error: error.message});
        }   
    }

// Middleware Admin-only Access
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401);
        throw new Error("Admin Only");
    }
};

module.exports = { protect, adminOnly };
