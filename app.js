const express = require('express');
const app = express();

const apiRouter = require('./routers/api-router.js');
const articleRouter = require('./routers/articles-router.js');
const topicsRouter = require('./routers/topics-router.js');
const commentsRouter = require('./routers/comments-router.js');
const usersRouter = require('./routers/users-router.js');

const { handlePSQLErros } = require('./error-handlers/psql-errors.js')
const { handleCustomErrors } = require('./error-handlers/custom-errors.js')
const { handleInternalServerErrors } = require('./error-handlers/internal-server-errors.js')
const { handleRouteNotFoundErrors } = require('./error-handlers/route-not-found-errors.js')

app.use(express.json());

app.use('/api', apiRouter);
app.use('/api/articles', articleRouter);
app.use('/api/topics', topicsRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/users', usersRouter);

app.all('*', handleRouteNotFoundErrors)
app.use(handlePSQLErros);
app.use(handleCustomErrors);
app.use(handleInternalServerErrors);

module.exports = app; 