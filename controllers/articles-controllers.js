const {
    selectArticles,
    selectArticleById,
    updateArticleById,
    selectCommentsByArticleId,
    checkArticleIdExists,
    insertCommentByArticleId
} = require('../models/articles-models');
const { checkUsernameExists } = require('../models/users-models');
const { checkExists } = require('../utils/check-exists');

function getArticles(req, res, next) {

    const { topic } = req.query;

    const promises = [selectArticles(topic)];

    if(topic) {
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

    selectArticleById(article_id)
        .then((article) => {
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
        checkArticleIdExists(article_id)
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
    const { article_id } = req.params;

    checkUsernameExists(newComment.username)
        .then(() => {
            return checkArticleIdExists(article_id)
        })
        .then(() => {
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

function patchArticleById(req, res, next) {

    const { article_id } = req.params;
    const voteChange = req.body.inc_votes;

    const promises = [
        updateArticleById(article_id, voteChange),
        checkArticleIdExists(article_id)
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
    getArticleById,
    patchArticleById,
    getCommentsByArticleId,
    postCommentByArticleId
}