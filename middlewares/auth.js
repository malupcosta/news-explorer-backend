const jwt = require("jsonwebtoken");

const UnauthorizedError = require("../errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_MESSAGE } = require("../utils/constants");

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return next(new UnauthorizedError(UNAUTHORIZED_MESSAGE));
  }

  req.user = payload;

  return next();
}

module.exports = auth;
