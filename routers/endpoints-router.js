const { getEndpoints } = require('../controllers/endpoints-controllers.js');

const endpointsRouter = require('express').Router();

endpointsRouter.get(`/`, getEndpoints);

module.exports = endpointsRouter;
