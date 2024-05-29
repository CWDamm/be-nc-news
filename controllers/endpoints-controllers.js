const selectEndpoints = require('../models/endpoints-models')

function getEndpoints(req, res, next) {

        selectEndpoints()
            .then((endpoints) => {
                res.status(200).send( {endpoints} )
            })
            .catch((err) => {next(err)})
}

module.exports = { getEndpoints }