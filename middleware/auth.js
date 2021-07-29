const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.get("Authorization");
  if (!authorization) {
    req.isAuth = false;
    return next();
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    req.isAuth = false;
    return next();
  }

  let verifytoken;

  try {
    verifytoken = jwt.verify(token, process.env.Secret_string);
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  if (!verifytoken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = verifytoken.userId;
  return next();
};
