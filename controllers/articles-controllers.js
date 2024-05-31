const {
    selectArticles,
    selectArticleById,
    updateArticleById,
    selectCommentsByArticleId,
    insertCommentByArticleId,
    insertArticle
} = require('../models/articles-models');
const { checkExists } = require('../utils/check-exists');

function getArticles(req, res, next) {

    const { topic, sort_by, order } = req.query;

    const promises = [selectArticles(topic, sort_by, order)];

    if (topic) {
        promises.push(checkExists("topics", "slug", topic))
    }

    Promise.all(promises)
        .then((resolvedPromises) => {
            const articles = resolvedPromises[0];
            res.status(200).send({ articles })
        })
        .catch((err) => {
            next(err);
        })
}

function getArticleById(req, res, next) {

    const { article_id } = req.params;

    const promises = [
        selectArticleById(article_id),
        checkExists("articles", "article_id", article_id)
    ]

    Promise.all(promises)
        .then((resolvedPromises) => {
            const article = resolvedPromises[0];
            res.status(200).send({ article })
        })
        .catch((err) => {
            next(err);
        })
}

function getCommentsByArticleId(req, res, next) {

    const { article_id } = req.params;

    const promises = [
        selectCommentsByArticleId(article_id),
        checkExists("articles", "article_id", article_id)
    ]

    Promise.all(promises)
        .then((resolvedPromises) => {
            const comments = resolvedPromises[0];
            res.status(200).send({ comments })
        })
        .catch(err => {
            next(err);
        })
}

function postCommentByArticleId(req, res, next) {

    const newComment = req.body;
    const { username } = newComment;
    const { article_id } = req.params;

    checkExists("users", "username", username)
        .then(() => {
            return checkExists("articles", "article_id", article_id)
        })
        .then((result) => {
            return insertCommentByArticleId(newComment, article_id)
        })
        .then((result) => {
            const newComment = result;
            res.status(201).send({ newComment })
        })
        .catch(err => {
            next(err)
        })
}

function postArticles(req, res, next) {
    const newArticle = req.body;

    checkExists("users", "username", newArticle.author)
        .then(() => {
            return checkExists("topics", "slug", newArticle.topic)
        })
        .then(() => {
            return insertArticle(newArticle)
        })
        .then((newArticle) => {
            res.status(201).send({ newArticle })
        })
        .catch(err => {
            next(err)
        })
}

function patchArticleById(req, res, next) {

    const { article_id } = req.params;
    const voteChange = req.body.inc_votes;

    const promises = [
        updateArticleById(article_id, voteChange),
        checkExists("articles", "article_id", article_id)
    ]

    Promise.all(promises)
        .then((resolvedPromises) => {
            const updatedArticle = resolvedPromises[0];
            res.status(200).send({ updatedArticle })
        })
        .catch((err) => {
            next(err);
        })
}

module.exports = {
    getArticles,
    postArticles,
    getArticleById,
    patchArticleById,
    getCommentsByArticleId,
    postCommentByArticleId
}