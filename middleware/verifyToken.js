const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }
      req.user = decoded;
      next(); // Pass the request to the next middleware
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
}

module.exports = { verifyToken };
