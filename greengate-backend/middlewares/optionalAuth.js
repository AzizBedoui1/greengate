const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (err) {
      req.user = null;
    }
  }

  next();
};

module.exports = optionalAuth;
