const selectTopics = require('../models/topic-models')

function getTopics(req, res, next) {

    selectTopics()
        .then((topics) => {
            res.status(200).send({ topics })
        })
}

module.exports = { getTopics }