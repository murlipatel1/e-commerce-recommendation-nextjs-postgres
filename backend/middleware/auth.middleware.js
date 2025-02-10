const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken || req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Access denied, token missing" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        req.user = user;
        next();
    });
};
