const {
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    checkArticleIdExists,
    insertCommentByArticleId
} = require('../models/articles-models')
const checkUsernameExists = require('../models/users-models')


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

function getArticles(req, res, next) {

    selectArticles()
        .then((articles) => {
            res.status(200).send({ articles })
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
            const promises = [
                insertCommentByArticleId(newComment, article_id),
                checkArticleIdExists(article_id)
            ]
            return Promise.all(promises)
        })
        .then((resolvedPromises) => {
            const newComment = resolvedPromises[0];
            res.status(201).send({ newComment })
        })
        .catch(err => {
            next(err)
        })
}

module.exports = { getArticles, getArticleById, getCommentsByArticleId, postCommentByArticleId }