const { deleteCommentById, patchCommentById } = require('../controllers/comments-controllers.js');

const commentsRouter = require('express').Router();

commentsRouter.delete(`/:comment_id`, deleteCommentById);
commentsRouter.patch(`/:comment_id`, patchCommentById);

module.exports = commentsRouter;