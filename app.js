require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");

const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles");
const auth = require("./middlewares/auth");
const limiter = require("./middlewares/rateLimiter");
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

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);

app.post("/api/signup", validateCreateUser, createUser);
app.post("/api/signin", validateLogin, login);

app.use("/api", auth);

app.use("/api/users", usersRouter);
app.use("/api/articles", articlesRouter);

app.use((req, res, next) => {
  next(new NotFoundError(NOT_FOUND_MESSAGE));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
