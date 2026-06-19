const router = require("express").Router();

const {
  getArticles,
  createArticle,
  deleteArticle,
} = require("../controllers/articles");
const {
  validateCreateArticle,
  validateArticleId,
} = require("../middlewares/validators");

router.get("/", getArticles);
router.post("/", validateCreateArticle, createArticle);
router.delete("/:articleId", validateArticleId, deleteArticle);

module.exports = router;
