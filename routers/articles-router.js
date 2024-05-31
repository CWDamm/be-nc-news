const {
    getArticles,
    postArticles,
    getArticleById,
    patchArticleById,
    getCommentsByArticleId,
    postCommentByArticleId
} = require('../controllers/articles-controllers.js')

const articleRouter = require('express').Router();

articleRouter.route(`/`)
    .get(getArticles)
    .post(postArticles);

articleRouter.route(`/:article_id`)
    .get(getArticleById)
    .patch(patchArticleById);

articleRouter.route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postCommentByArticleId);

module.exports = articleRouter;