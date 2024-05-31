const { deleteCommentById } = require('../controllers/comments-controllers.js');

const commentsRouter = require('express').Router();

commentsRouter.delete(`/:comment_id`, deleteCommentById);

module.exports = commentsRouter;