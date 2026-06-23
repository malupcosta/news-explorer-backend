const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const { JWT_SECRET } = require("../utils/config");
const {
  STATUS_CREATED,
  BAD_REQUEST_MESSAGE,
  UNAUTHORIZED_MESSAGE,
  CONFLICT_MESSAGE,
} = require("../utils/constants");

function createUser(req, res, next) {
  const { email, password, name } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .then((user) => res.status(STATUS_CREATED).send({
      _id: user._id,
      email: user.email,
      name: user.name,
    }))
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError(CONFLICT_MESSAGE));
      }

      if (error.name === "ValidationError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }

      return next(error);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(UNAUTHORIZED_MESSAGE);
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        return res.send({ token });
      });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch(next);
}

module.exports = {
  createUser,
  login,
  getCurrentUser,
};
