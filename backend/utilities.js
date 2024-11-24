const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"]; // Common practice to use lowercase 'authorization'
  const token = authHeader && authHeader.split(" ")[1]; // Extract token from the Authorization header

  if (!token) {
    return res.status(401).send("Token required"); // If no token, respond with 401 (Unauthorized)
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    // Verify the token
    if (err) {
      return res.status(403).send("Forbidden: Invalid token"); // If token is invalid or expired, respond with 403 (Forbidden)
    }
    req.user = user; // Attach the user data from the token to the request object
    next(); // Proceed to the next middleware or route handler
  });
}

module.exports = { authenticateToken };
