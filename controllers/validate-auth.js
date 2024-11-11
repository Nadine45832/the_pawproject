const jwt = require('jsonwebtoken');
const serverConfig = require('../configs/server.js');
const { authCookieName } = require('../utils/constrains.js');

const verifyToken = (token) => {
    return jwt.verify(token, serverConfig.jwtSecret);
};

const setLocals = (res, tokenData) => {
    res.locals = { email: tokenData.email };
};

const handleAuthenticationError = (res, message = "Authentication failed") => {
    res.clearCookie(authCookieName);
    return res.status(401).json({ error: message });
};

const isAuthenticated = (req, res, next) => {
    const token = req.cookies[authCookieName];

    if (!token) {
        return handleAuthenticationError(res, "No authentication token provided");
    }

    try {
        const tokenData = verifyToken(token);
        setLocals(res, tokenData);
        next();
    } catch (err) {
        handleAuthenticationError(res, `Authentication failed: ${err.message}`);
    }
};

module.exports = {
    isAuthenticated,
    verifyToken,
};
