
const { removeCommentById, updateCommentById } = require("../models/comments-models");
const { checkExists } = require('../utils/check-exists');

function deleteCommentById(req, res, next) {
    const { comment_id } = req.params;

    removeCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            next(err)
        })
}

function patchCommentById(req, res, next) {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;

    const promises = [
        updateCommentById(comment_id, inc_votes),
        checkExists("comments", "comment_id", comment_id)
    ]

    Promise.all(promises)
        .then(([updatedComment]) => {
            res.status(200).send({ updatedComment });
        })
        .catch(err => {
            next(err)
        })
}

module.exports = { deleteCommentById, patchCommentById }