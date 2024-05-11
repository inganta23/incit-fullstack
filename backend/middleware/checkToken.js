const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized. Access token is missing.' });
    }
    req.accessToken = token;
    next();
};

module.exports = { authMiddleware }