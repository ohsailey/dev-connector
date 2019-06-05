const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token");

  // if token is not exist, user's authorization is not denied
  if (!token) {
    return res.status(401).json({ msg: "no token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("secretKey"));
    req.user = decoded.user;
    next();
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ msg: "token is not valid" });
  }
};
