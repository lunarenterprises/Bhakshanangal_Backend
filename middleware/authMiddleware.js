const jwt = require('jsonwebtoken');
const userModel = require('../model/login')

// JWT middleware
const verifyToken = (req, res, next) => {
    let SECRET_KEY = process.env.JWT_SECRET_KEY
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET_KEY, async (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: "Authentication failed: Invalid token" });
        }
        const userData = await userModel.CheckUserWithId(decoded.user_id)
        if (!userData || userData.length === 0) {
            return res.send({
                result: false,
                message: "User not found. Invalid user id"
            })
        }
        if (userData[0].user_status !== "active") {
            return res.send({
                result: false,
                message: "You need to activate your account first to continue"
            })
        }
        req.user = decoded
        next()
    })
}

// Authorization middleware (Role-based)
const authorize = (allowedRoles = ['admin','user']) => {
    return (req, res, next) => {
        const user = req.user;

        if (!user || !user.role) {
            return res.status(403).send({ error: "Access denied: No role assigned" });
        }

        if (!allowedRoles.includes(user.role)) {
            return res.status(403).send({ error: "Access denied: Insufficient permissions" });
        }

        next();
    };
};

module.exports = { verifyToken, authorize };