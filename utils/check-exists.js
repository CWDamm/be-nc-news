const db = require("../db/connection");
const format = require('pg-format');

function checkExists(table, column, value) {
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column);
    const errMsg = `${column} '${value}' not found`

    if(!value) {
        return Promise.reject({ status: 400, msg: "Bad request" });
    }

    return db
        .query(queryStr, [value])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: errMsg });
            }
        })
}

module.exports = { checkExists }