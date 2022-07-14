const jwt = require("jsonwebtoken");
const JWT_Secret = "zainkhanbaloch@abc.com";

const fetchuser = (req, res, next) => {
  const string = req.header("auth-token");
  if (!string) {
    res.status(401).json({ error: "Please Enter A Valid Token" });
  }

  try {
    const data = jwt.verify(string,JWT_Secret);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Please Enter A Valid Token" });
  }
};

module.exports = fetchuser;
