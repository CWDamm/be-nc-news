const apiRouter = require('express').Router();

const topicsRouter = require('./topics-router.js');
const articleRouter = require('./articles-router.js');
const commentsRouter = require('./comments-router.js');
const usersRouter = require('./users-router.js');
const endpointsRouter = require('./endpoints-router.js');

apiRouter.get('/', endpointsRouter);
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articleRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);

module.exports = apiRouter;