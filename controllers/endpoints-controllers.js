const selectEndpoints = require('../models/endpoints-models')

function getEndpoints(req, res, next) {

        selectEndpoints()
            .then((endpoints) => {
                res.status(200).send( {endpoints} )
            })

}

module.exports = { getEndpoints }