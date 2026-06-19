require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { errors } = require("celebrate");

const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const auth = require("./middlewares/auth");
const errorHandler = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { createUser, login } = require("./controllers/users");
const {
  validateCreateUser,
  validateLogin,
} = require("./middlewares/validators");
const { MONGO_URL } = require("./utils/config");
const NotFoundError = require("./errors/NotFoundError");
const { NOT_FOUND_MESSAGE } = require("./utils/constants");

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect(MONGO_URL);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

app.post("/signup", validateCreateUser, createUser);
app.post("/signin", validateLogin, login);

app.use(auth);

app.use("/users", usersRouter);
app.use("/articles", articlesRouter);

app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_MESSAGE));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
