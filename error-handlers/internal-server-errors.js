exports.handleInternalServerErrors = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server Error' })
}