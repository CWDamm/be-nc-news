const db = require("../db/connection");

function checkUsernameExists(username) {
    return db
        .query('SELECT * FROM users WHERE username = $1', [username])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "username not found" })
            }
        })
}

function selectUsers() {
    return db
        .query(`SELECT * FROM users`)
        .then(({ rows }) => {
            return rows;
        })
}

module.exports = {checkUsernameExists, selectUsers}

