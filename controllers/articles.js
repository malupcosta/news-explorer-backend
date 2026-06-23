const Article = require("../models/article");
const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");
const {
  STATUS_CREATED,
  BAD_REQUEST_MESSAGE,
  FORBIDDEN_MESSAGE,
  NOT_FOUND_MESSAGE,
} = require("../utils/constants");

function getArticles(req, res, next) {
  Article.find({ owner: req.user._id })
    .then((articles) => res.send(articles))
    .catch(next);
}

function createArticle(req, res, next) {
  const {
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
  } = req.body;

  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.status(STATUS_CREATED).send(article))
    .catch((error) => {
      if (error.name === "ValidationError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }

      return next(error);
    });
}

function deleteArticle(req, res, next) {
  Article.findById(req.params.articleId)
    .select("+owner")
    .orFail()
    .then((article) => {
      if (article.owner.toString() !== req.user._id) {
        throw new ForbiddenError(FORBIDDEN_MESSAGE);
      }

      return Article.findByIdAndDelete(req.params.articleId).then(() => res.send({ message: "Artigo removido com sucesso." }));
    })
    .catch((error) => {
      if (error.name === "DocumentNotFoundError") {
        return next(new NotFoundError(NOT_FOUND_MESSAGE));
      }

      if (error.name === "CastError") {
        return next(new BadRequestError(BAD_REQUEST_MESSAGE));
      }

      return next(error);
    });
}

module.exports = {
  getArticles,
  createArticle,
  deleteArticle,
};
