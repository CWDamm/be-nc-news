exports.handlePSQLErros = (err, req, res, next) => {
    // console.log("------>", err);
    if (["22P02", "23502", "23503"].includes(err.code)) {
        res.status(400).send({ msg: "Bad request" });
    } else {
        next(err)
    }
}