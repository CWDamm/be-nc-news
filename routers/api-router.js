const apiRouter = require('express').Router();
const { getEndpoints } = require('../controllers/endpoints-controllers.js');

apiRouter.get('/', getEndpoints);

module.exports = apiRouter;